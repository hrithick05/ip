import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kjbpwxubekbqiqqjnowh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYnB3eHViZWticWlxcWpub3doIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjIzMjA0NCwiZXhwIjoyMDkxODA4MDQ0fQ.zVd-nIYeT0H0o2k5ewA-KOcTEzeWCe6VeHKsDGKs1JQ";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

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

async function runSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`
    },
    body: JSON.stringify({ sql })
  });
  return res;
}

// Use pg endpoint directly
async function createTables() {
  const res = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`
    },
    body: JSON.stringify({ query: schema })
  });
  const text = await res.text();
  console.log("Schema response:", res.status, text.slice(0, 200));
}

const questions = [
  // Software Engineering / DSA
  { field: "Software Engineering", category: "DSA", question_text: "What is the time complexity of binary search?", option1: "O(n)", option2: "O(log n)", option3: "O(n log n)", option4: "O(1)", correct_answer: "O(log n)" },
  { field: "Software Engineering", category: "DSA", question_text: "Which data structure uses LIFO order?", option1: "Queue", option2: "Heap", option3: "Stack", option4: "Linked List", correct_answer: "Stack" },
  { field: "Software Engineering", category: "DSA", question_text: "What is the worst-case time complexity of quicksort?", option1: "O(n log n)", option2: "O(n)", option3: "O(n²)", option4: "O(log n)", correct_answer: "O(n²)" },
  { field: "Software Engineering", category: "DSA", question_text: "Which traversal visits root first, then left, then right?", option1: "Inorder", option2: "Postorder", option3: "Levelorder", option4: "Preorder", correct_answer: "Preorder" },
  { field: "Software Engineering", category: "DSA", question_text: "What data structure is used in BFS?", option1: "Stack", option2: "Queue", option3: "Heap", option4: "Tree", correct_answer: "Queue" },
  { field: "Software Engineering", category: "DSA", question_text: "Which sorting algorithm is stable and has O(n log n) average case?", option1: "Quick Sort", option2: "Heap Sort", option3: "Merge Sort", option4: "Selection Sort", correct_answer: "Merge Sort" },
  { field: "Software Engineering", category: "DSA", question_text: "What is the space complexity of DFS on a graph with V vertices?", option1: "O(1)", option2: "O(V)", option3: "O(V²)", option4: "O(E)", correct_answer: "O(V)" },
  { field: "Software Engineering", category: "DSA", question_text: "A hash table lookup has which average time complexity?", option1: "O(n)", option2: "O(log n)", option3: "O(1)", option4: "O(n²)", correct_answer: "O(1)" },
  // Software Engineering / System Design
  { field: "Software Engineering", category: "System Design", question_text: "What does CAP theorem stand for?", option1: "Consistency, Availability, Partition tolerance", option2: "Caching, API, Performance", option3: "Concurrency, Atomicity, Persistence", option4: "Clustering, Availability, Partitioning", correct_answer: "Consistency, Availability, Partition tolerance" },
  { field: "Software Engineering", category: "System Design", question_text: "Which pattern separates read and write operations into different models?", option1: "Saga", option2: "CQRS", option3: "Event Sourcing", option4: "Circuit Breaker", correct_answer: "CQRS" },
  { field: "Software Engineering", category: "System Design", question_text: "What is the purpose of a load balancer?", option1: "Store session data", option2: "Distribute traffic across servers", option3: "Cache database queries", option4: "Encrypt network traffic", correct_answer: "Distribute traffic across servers" },
  { field: "Software Engineering", category: "System Design", question_text: "Which database type is best suited for hierarchical/graph data?", option1: "Relational", option2: "Columnar", option3: "Graph", option4: "Key-Value", correct_answer: "Graph" },
  { field: "Software Engineering", category: "System Design", question_text: "What does CDN stand for?", option1: "Central Data Node", option2: "Content Delivery Network", option3: "Cached DNS Node", option4: "Cloud Data Network", correct_answer: "Content Delivery Network" },
  { field: "Software Engineering", category: "System Design", question_text: "Which consistency model allows reading stale data for higher availability?", option1: "Strong consistency", option2: "Linearizability", option3: "Eventual consistency", option4: "Serializability", correct_answer: "Eventual consistency" },
  // Software Engineering / OOP
  { field: "Software Engineering", category: "OOP", question_text: "Which OOP principle hides internal implementation details?", option1: "Inheritance", option2: "Polymorphism", option3: "Encapsulation", option4: "Abstraction", correct_answer: "Encapsulation" },
  { field: "Software Engineering", category: "OOP", question_text: "What is method overriding?", option1: "Defining two methods with same name but different params", option2: "A child class providing its own implementation of a parent method", option3: "Calling a method from a constructor", option4: "Making a method private", correct_answer: "A child class providing its own implementation of a parent method" },
  { field: "Software Engineering", category: "OOP", question_text: "Which design pattern ensures only one instance of a class exists?", option1: "Factory", option2: "Observer", option3: "Singleton", option4: "Decorator", correct_answer: "Singleton" },
  { field: "Software Engineering", category: "OOP", question_text: "What does SOLID stand for in software design?", option1: "Single, Open, Liskov, Interface, Dependency", option2: "Scalable, Object, Linked, Integrated, Dynamic", option3: "Simple, Optimized, Layered, Isolated, Distributed", option4: "Structured, Ordered, Linked, Inherited, Decoupled", correct_answer: "Single, Open, Liskov, Interface, Dependency" },
  // Data Science / Python
  { field: "Data Science", category: "Python", question_text: "Which library is primarily used for data manipulation in Python?", option1: "NumPy", option2: "Matplotlib", option3: "Pandas", option4: "Scikit-learn", correct_answer: "Pandas" },
  { field: "Data Science", category: "Python", question_text: "What does the `.shape` attribute return in a Pandas DataFrame?", option1: "Column names", option2: "Data types", option3: "Rows and columns count as a tuple", option4: "Index values", correct_answer: "Rows and columns count as a tuple" },
  { field: "Data Science", category: "Python", question_text: "Which function is used to read a CSV file in Pandas?", option1: "pd.load_csv()", option2: "pd.read_csv()", option3: "pd.open_csv()", option4: "pd.import_csv()", correct_answer: "pd.read_csv()" },
  { field: "Data Science", category: "Python", question_text: "What is a Python list comprehension?", option1: "A way to import lists from modules", option2: "A concise way to create lists using a single line expression", option3: "A method to sort lists", option4: "A built-in list function", correct_answer: "A concise way to create lists using a single line expression" },
  { field: "Data Science", category: "Python", question_text: "Which keyword is used to define a generator function in Python?", option1: "return", option2: "async", option3: "yield", option4: "generate", correct_answer: "yield" },
  // Data Science / Machine Learning
  { field: "Data Science", category: "Machine Learning", question_text: "What is overfitting in machine learning?", option1: "Model performs well on training data but poorly on unseen data", option2: "Model performs poorly on both training and test data", option3: "Model has too few parameters", option4: "Model trains too slowly", correct_answer: "Model performs well on training data but poorly on unseen data" },
  { field: "Data Science", category: "Machine Learning", question_text: "Which algorithm is used for classification and regression using decision boundaries?", option1: "K-Means", option2: "PCA", option3: "SVM", option4: "Apriori", correct_answer: "SVM" },
  { field: "Data Science", category: "Machine Learning", question_text: "What does the learning rate control in gradient descent?", option1: "Number of training epochs", option2: "Size of steps taken towards the minimum", option3: "Number of hidden layers", option4: "Batch size", correct_answer: "Size of steps taken towards the minimum" },
  { field: "Data Science", category: "Machine Learning", question_text: "Which metric is best for imbalanced classification datasets?", option1: "Accuracy", option2: "Mean Squared Error", option3: "F1 Score", option4: "R² Score", correct_answer: "F1 Score" },
  { field: "Data Science", category: "Machine Learning", question_text: "What is the purpose of cross-validation?", option1: "Speed up training", option2: "Reduce model size", option3: "Estimate model performance on unseen data", option4: "Normalize features", correct_answer: "Estimate model performance on unseen data" },
  // DevOps / Docker
  { field: "DevOps", category: "Docker", question_text: "What is a Docker image?", option1: "A running container instance", option2: "A read-only template used to create containers", option3: "A virtual machine snapshot", option4: "A Docker network configuration", correct_answer: "A read-only template used to create containers" },
  { field: "DevOps", category: "Docker", question_text: "Which command builds a Docker image from a Dockerfile?", option1: "docker run", option2: "docker pull", option3: "docker build", option4: "docker create", correct_answer: "docker build" },
  { field: "DevOps", category: "Docker", question_text: "What does Docker Compose do?", option1: "Builds Docker images faster", option2: "Manages multi-container Docker applications", option3: "Pushes images to Docker Hub", option4: "Monitors container health", correct_answer: "Manages multi-container Docker applications" },
  { field: "DevOps", category: "Docker", question_text: "Which file defines a Docker container's environment?", option1: "docker-compose.yml only", option2: ".dockerignore", option3: "Dockerfile", option4: "container.json", correct_answer: "Dockerfile" },
  // DevOps / CI/CD
  { field: "DevOps", category: "CI/CD", question_text: "What does CI stand for in CI/CD?", option1: "Container Integration", option2: "Continuous Integration", option3: "Cloud Infrastructure", option4: "Code Inspection", correct_answer: "Continuous Integration" },
  { field: "DevOps", category: "CI/CD", question_text: "Which tool is commonly used for CI/CD pipelines?", option1: "Figma", option2: "Postman", option3: "GitHub Actions", option4: "Swagger", correct_answer: "GitHub Actions" },
  { field: "DevOps", category: "CI/CD", question_text: "What is the purpose of a staging environment?", option1: "Store production backups", option2: "Test changes before deploying to production", option3: "Monitor live user traffic", option4: "Run database migrations only", correct_answer: "Test changes before deploying to production" },
  { field: "DevOps", category: "CI/CD", question_text: "What is a blue-green deployment?", option1: "Deploying to two cloud providers simultaneously", option2: "Running two identical environments and switching traffic", option3: "A color-coded branching strategy", option4: "Deploying only frontend and backend separately", correct_answer: "Running two identical environments and switching traffic" },
  // HR
  { field: "HR", category: "General", question_text: "Tell me about yourself.", option1: null, option2: null, option3: null, option4: null, correct_answer: null },
  { field: "HR", category: "General", question_text: "What are your greatest strengths?", option1: null, option2: null, option3: null, option4: null, correct_answer: null },
  { field: "HR", category: "General", question_text: "What is your biggest weakness and how are you working on it?", option1: null, option2: null, option3: null, option4: null, correct_answer: null },
  { field: "HR", category: "General", question_text: "Where do you see yourself in 5 years?", option1: null, option2: null, option3: null, option4: null, correct_answer: null },
  { field: "HR", category: "General", question_text: "Why do you want to work at this company?", option1: null, option2: null, option3: null, option4: null, correct_answer: null },
  { field: "HR", category: "General", question_text: "Describe a time you handled a conflict with a teammate.", option1: null, option2: null, option3: null, option4: null, correct_answer: null },
  { field: "HR", category: "General", question_text: "Tell me about a challenging project and how you overcame it.", option1: null, option2: null, option3: null, option4: null, correct_answer: null },
  { field: "HR", category: "General", question_text: "How do you prioritize tasks when you have multiple deadlines?", option1: null, option2: null, option3: null, option4: null, correct_answer: null },
  { field: "HR", category: "General", question_text: "Why are you leaving your current job?", option1: null, option2: null, option3: null, option4: null, correct_answer: null },
  { field: "HR", category: "General", question_text: "What motivates you to do your best work?", option1: null, option2: null, option3: null, option4: null, correct_answer: null },
];

const codingQuestions = [
  { title: "Two Sum", difficulty: "Easy", description: "Given an array of integers and a target, return indices of the two numbers that add up to the target.", input_data: "2 7 11 15\n9", expected_output: "0 1" },
  { title: "Reverse a String", difficulty: "Easy", description: "Read a string from input and print it reversed.", input_data: "hello", expected_output: "olleh" },
  { title: "FizzBuzz", difficulty: "Easy", description: "Print numbers from 1 to N. For multiples of 3 print Fizz, multiples of 5 print Buzz, both print FizzBuzz.", input_data: "15", expected_output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
  { title: "Palindrome Check", difficulty: "Easy", description: "Given a string, print True if it is a palindrome, otherwise print False.", input_data: "racecar", expected_output: "True" },
  { title: "Factorial", difficulty: "Easy", description: "Given a number N, print its factorial.", input_data: "5", expected_output: "120" },
  { title: "Count Vowels", difficulty: "Easy", description: "Given a string, count and print the number of vowels (a, e, i, o, u).", input_data: "hello world", expected_output: "3" },
  { title: "Find Maximum", difficulty: "Easy", description: "Given a list of space-separated integers, print the maximum value.", input_data: "3 1 4 1 5 9 2 6", expected_output: "9" },
  { title: "Sum of List", difficulty: "Easy", description: "Given a list of space-separated integers, print their sum.", input_data: "1 2 3 4 5", expected_output: "15" },
  { title: "Binary Search", difficulty: "Medium", description: "Given a sorted list and a target, print the index of the target using binary search. Print -1 if not found.", input_data: "1 3 5 7 9 11\n7", expected_output: "3" },
  { title: "Anagram Check", difficulty: "Medium", description: "Given two strings on separate lines, print True if they are anagrams, otherwise False.", input_data: "listen\nsilent", expected_output: "True" },
  { title: "Fibonacci Sequence", difficulty: "Medium", description: "Print the first N numbers of the Fibonacci sequence space-separated.", input_data: "8", expected_output: "0 1 1 2 3 5 8 13" },
  { title: "Remove Duplicates", difficulty: "Medium", description: "Given a list of space-separated integers, print the list with duplicates removed, preserving order.", input_data: "4 3 2 4 1 3 5", expected_output: "4 3 2 1 5" },
  { title: "Longest Common Prefix", difficulty: "Medium", description: "Given space-separated words, print the longest common prefix. Print empty string if none.", input_data: "flower flow flight", expected_output: "fl" },
  { title: "Valid Parentheses", difficulty: "Medium", description: "Given a string of brackets, print True if they are balanced, otherwise False.", input_data: "({[]})", expected_output: "True" },
  { title: "Word Frequency", difficulty: "Medium", description: "Given a sentence, print each unique word and its count as 'word:count', sorted alphabetically.", input_data: "the cat sat on the mat the cat", expected_output: "cat:2\nmat:1\non:1\nsat:1\nthe:3" },
  { title: "Merge Intervals", difficulty: "Hard", description: "Given pairs of intervals (one per line as 'start end'), merge overlapping intervals and print them.", input_data: "1 3\n2 6\n8 10\n15 18", expected_output: "1 6\n8 10\n15 18" },
  { title: "Longest Increasing Subsequence", difficulty: "Hard", description: "Given space-separated integers, print the length of the longest strictly increasing subsequence.", input_data: "10 9 2 5 3 7 101 18", expected_output: "4" },
  { title: "Coin Change", difficulty: "Hard", description: "Given coin denominations (space-separated) and an amount, print the minimum number of coins needed. Print -1 if impossible.", input_data: "1 5 6 9\n11", expected_output: "2" },
];

async function seed() {
  // Create tables via SQL
  console.log("Creating tables...");
  const sqlRes = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: { "apikey": SERVICE_KEY, "Authorization": `Bearer ${SERVICE_KEY}` }
  });
  console.log("Supabase reachable:", sqlRes.status);

  // Insert questions
  console.log("Seeding questions...");
  const { error: qErr, data: qData } = await supabase.from("questions").insert(questions).select("id");
  if (qErr) console.error("questions error:", qErr.message);
  else console.log(`✓ Inserted ${qData.length} questions`);

  // Insert coding questions
  console.log("Seeding coding_questions...");
  const { error: cErr, data: cData } = await supabase.from("coding_questions").insert(codingQuestions).select("id");
  if (cErr) console.error("coding_questions error:", cErr.message);
  else console.log(`✓ Inserted ${cData.length} coding questions`);
}

seed();
