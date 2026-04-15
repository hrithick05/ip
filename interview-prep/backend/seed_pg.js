import pg from "pg";

const { Client } = pg;

// Extract project ref from Supabase URL: kjbpwxubekbqiqqjnowh
const client = new Client({
  connectionString: "postgresql://postgres.kjbpwxubekbqiqqjnowh:postgres@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

const schema = `
create extension if not exists pgcrypto;

create table if not exists coding_questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  difficulty text default 'Easy',
  description text,
  input_data text default '',
  expected_output text default ''
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  question_id uuid references coding_questions(id),
  code text,
  status text,
  created_at timestamptz default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  question_text text,
  option1 text,
  option2 text,
  option3 text,
  option4 text,
  correct_answer text,
  field text,
  category text
);

create table if not exists interview_submissions (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  field text,
  category text,
  score int,
  created_at timestamptz default now()
);

create table if not exists hr_answers (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  question_id uuid references questions(id),
  answer_text text,
  created_at timestamptz default now()
);
`;

async function main() {
  await client.connect();
  console.log("Connected to Supabase Postgres");

  await client.query(schema);
  console.log("✓ Tables created");

  const questions = [
    ["Software Engineering","DSA","What is the time complexity of binary search?","O(n)","O(log n)","O(n log n)","O(1)","O(log n)"],
    ["Software Engineering","DSA","Which data structure uses LIFO order?","Queue","Heap","Stack","Linked List","Stack"],
    ["Software Engineering","DSA","What is the worst-case time complexity of quicksort?","O(n log n)","O(n)","O(n²)","O(log n)","O(n²)"],
    ["Software Engineering","DSA","Which traversal visits root first, then left, then right?","Inorder","Postorder","Levelorder","Preorder","Preorder"],
    ["Software Engineering","DSA","What data structure is used in BFS?","Stack","Queue","Heap","Tree","Queue"],
    ["Software Engineering","DSA","Which sorting algorithm is stable and has O(n log n) average case?","Quick Sort","Heap Sort","Merge Sort","Selection Sort","Merge Sort"],
    ["Software Engineering","DSA","What is the space complexity of DFS on a graph with V vertices?","O(1)","O(V)","O(V²)","O(E)","O(V)"],
    ["Software Engineering","DSA","A hash table lookup has which average time complexity?","O(n)","O(log n)","O(1)","O(n²)","O(1)"],
    ["Software Engineering","System Design","What does CAP theorem stand for?","Consistency, Availability, Partition tolerance","Caching, API, Performance","Concurrency, Atomicity, Persistence","Clustering, Availability, Partitioning","Consistency, Availability, Partition tolerance"],
    ["Software Engineering","System Design","Which pattern separates read and write operations into different models?","Saga","CQRS","Event Sourcing","Circuit Breaker","CQRS"],
    ["Software Engineering","System Design","What is the purpose of a load balancer?","Store session data","Distribute traffic across servers","Cache database queries","Encrypt network traffic","Distribute traffic across servers"],
    ["Software Engineering","System Design","Which database type is best suited for hierarchical/graph data?","Relational","Columnar","Graph","Key-Value","Graph"],
    ["Software Engineering","System Design","What does CDN stand for?","Central Data Node","Content Delivery Network","Cached DNS Node","Cloud Data Network","Content Delivery Network"],
    ["Software Engineering","System Design","Which consistency model allows reading stale data for higher availability?","Strong consistency","Linearizability","Eventual consistency","Serializability","Eventual consistency"],
    ["Software Engineering","OOP","Which OOP principle hides internal implementation details?","Inheritance","Polymorphism","Encapsulation","Abstraction","Encapsulation"],
    ["Software Engineering","OOP","What is method overriding?","Defining two methods with same name but different params","A child class providing its own implementation of a parent method","Calling a method from a constructor","Making a method private","A child class providing its own implementation of a parent method"],
    ["Software Engineering","OOP","Which design pattern ensures only one instance of a class exists?","Factory","Observer","Singleton","Decorator","Singleton"],
    ["Software Engineering","OOP","What does SOLID stand for in software design?","Single, Open, Liskov, Interface, Dependency","Scalable, Object, Linked, Integrated, Dynamic","Simple, Optimized, Layered, Isolated, Distributed","Structured, Ordered, Linked, Inherited, Decoupled","Single, Open, Liskov, Interface, Dependency"],
    ["Data Science","Python","Which library is primarily used for data manipulation in Python?","NumPy","Matplotlib","Pandas","Scikit-learn","Pandas"],
    ["Data Science","Python","What does the .shape attribute return in a Pandas DataFrame?","Column names","Data types","Rows and columns count as a tuple","Index values","Rows and columns count as a tuple"],
    ["Data Science","Python","Which function is used to read a CSV file in Pandas?","pd.load_csv()","pd.read_csv()","pd.open_csv()","pd.import_csv()","pd.read_csv()"],
    ["Data Science","Python","What is a Python list comprehension?","A way to import lists from modules","A concise way to create lists using a single line expression","A method to sort lists","A built-in list function","A concise way to create lists using a single line expression"],
    ["Data Science","Python","Which keyword is used to define a generator function in Python?","return","async","yield","generate","yield"],
    ["Data Science","Machine Learning","What is overfitting in machine learning?","Model performs well on training data but poorly on unseen data","Model performs poorly on both training and test data","Model has too few parameters","Model trains too slowly","Model performs well on training data but poorly on unseen data"],
    ["Data Science","Machine Learning","Which algorithm is used for classification and regression using decision boundaries?","K-Means","PCA","SVM","Apriori","SVM"],
    ["Data Science","Machine Learning","What does the learning rate control in gradient descent?","Number of training epochs","Size of steps taken towards the minimum","Number of hidden layers","Batch size","Size of steps taken towards the minimum"],
    ["Data Science","Machine Learning","Which metric is best for imbalanced classification datasets?","Accuracy","Mean Squared Error","F1 Score","R² Score","F1 Score"],
    ["Data Science","Machine Learning","What is the purpose of cross-validation?","Speed up training","Reduce model size","Estimate model performance on unseen data","Normalize features","Estimate model performance on unseen data"],
    ["DevOps","Docker","What is a Docker image?","A running container instance","A read-only template used to create containers","A virtual machine snapshot","A Docker network configuration","A read-only template used to create containers"],
    ["DevOps","Docker","Which command builds a Docker image from a Dockerfile?","docker run","docker pull","docker build","docker create","docker build"],
    ["DevOps","Docker","What does Docker Compose do?","Builds Docker images faster","Manages multi-container Docker applications","Pushes images to Docker Hub","Monitors container health","Manages multi-container Docker applications"],
    ["DevOps","Docker","Which file defines a Docker container's environment?","docker-compose.yml only",".dockerignore","Dockerfile","container.json","Dockerfile"],
    ["DevOps","CI/CD","What does CI stand for in CI/CD?","Container Integration","Continuous Integration","Cloud Infrastructure","Code Inspection","Continuous Integration"],
    ["DevOps","CI/CD","Which tool is commonly used for CI/CD pipelines?","Figma","Postman","GitHub Actions","Swagger","GitHub Actions"],
    ["DevOps","CI/CD","What is the purpose of a staging environment?","Store production backups","Test changes before deploying to production","Monitor live user traffic","Run database migrations only","Test changes before deploying to production"],
    ["DevOps","CI/CD","What is a blue-green deployment?","Deploying to two cloud providers simultaneously","Running two identical environments and switching traffic","A color-coded branching strategy","Deploying only frontend and backend separately","Running two identical environments and switching traffic"],
    ["HR","General","Tell me about yourself.",null,null,null,null,null],
    ["HR","General","What are your greatest strengths?",null,null,null,null,null],
    ["HR","General","What is your biggest weakness and how are you working on it?",null,null,null,null,null],
    ["HR","General","Where do you see yourself in 5 years?",null,null,null,null,null],
    ["HR","General","Why do you want to work at this company?",null,null,null,null,null],
    ["HR","General","Describe a time you handled a conflict with a teammate.",null,null,null,null,null],
    ["HR","General","Tell me about a challenging project and how you overcame it.",null,null,null,null,null],
    ["HR","General","How do you prioritize tasks when you have multiple deadlines?",null,null,null,null,null],
    ["HR","General","Why are you leaving your current job?",null,null,null,null,null],
    ["HR","General","What motivates you to do your best work?",null,null,null,null,null],
  ];

  for (const q of questions) {
    await client.query(
      `INSERT INTO questions (field, category, question_text, option1, option2, option3, option4, correct_answer) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      q
    );
  }
  console.log(`✓ Inserted ${questions.length} questions`);

  const coding = [
    ["Two Sum","Easy","Given an array of integers and a target, return indices of the two numbers that add up to the target.","2 7 11 15\n9","0 1"],
    ["Reverse a String","Easy","Read a string from input and print it reversed.","hello","olleh"],
    ["FizzBuzz","Easy","Print numbers from 1 to N. For multiples of 3 print Fizz, multiples of 5 print Buzz, both print FizzBuzz.","15","1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz"],
    ["Palindrome Check","Easy","Given a string, print True if it is a palindrome, otherwise print False.","racecar","True"],
    ["Factorial","Easy","Given a number N, print its factorial.","5","120"],
    ["Count Vowels","Easy","Given a string, count and print the number of vowels (a, e, i, o, u).","hello world","3"],
    ["Find Maximum","Easy","Given a list of space-separated integers, print the maximum value.","3 1 4 1 5 9 2 6","9"],
    ["Sum of List","Easy","Given a list of space-separated integers, print their sum.","1 2 3 4 5","15"],
    ["Binary Search","Medium","Given a sorted list and a target, print the index of the target using binary search. Print -1 if not found.","1 3 5 7 9 11\n7","3"],
    ["Anagram Check","Medium","Given two strings on separate lines, print True if they are anagrams, otherwise False.","listen\nsilent","True"],
    ["Fibonacci Sequence","Medium","Print the first N numbers of the Fibonacci sequence space-separated.","8","0 1 1 2 3 5 8 13"],
    ["Remove Duplicates","Medium","Given a list of space-separated integers, print the list with duplicates removed, preserving order.","4 3 2 4 1 3 5","4 3 2 1 5"],
    ["Longest Common Prefix","Medium","Given space-separated words, print the longest common prefix. Print empty string if none.","flower flow flight","fl"],
    ["Valid Parentheses","Medium","Given a string of brackets, print True if they are balanced, otherwise False.","({[]})","True"],
    ["Word Frequency","Medium","Given a sentence, print each unique word and its count as 'word:count', sorted alphabetically.","the cat sat on the mat the cat","cat:2\nmat:1\non:1\nsat:1\nthe:3"],
    ["Merge Intervals","Hard","Given pairs of intervals (one per line as 'start end'), merge overlapping intervals and print them.","1 3\n2 6\n8 10\n15 18","1 6\n8 10\n15 18"],
    ["Longest Increasing Subsequence","Hard","Given space-separated integers, print the length of the longest strictly increasing subsequence.","10 9 2 5 3 7 101 18","4"],
    ["Coin Change","Hard","Given coin denominations (space-separated) and an amount, print the minimum number of coins needed. Print -1 if impossible.","1 5 6 9\n11","2"],
  ];

  for (const c of coding) {
    await client.query(
      `INSERT INTO coding_questions (title, difficulty, description, input_data, expected_output) VALUES ($1,$2,$3,$4,$5)`,
      c
    );
  }
  console.log(`✓ Inserted ${coding.length} coding questions`);

  await client.end();
  console.log("Done!");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
