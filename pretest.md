Campus Hiring Evaluation - Pre-Test

Setup

Terms & Conditions

This document and the associated assessment contain confidential and proprietary information

of Afford Medical Technologies Private Limited (hereinafter "Affordmed"'). By accessing this

material or participating in this assessment, you acknowledge receipt of this information for the

sole purpose of evaluating your candidacy for an internship, contract, or employment with

Affordmed. You hereby agree to the following:

• Confidentiality: You shall maintain the strict confidentiality of all information received and

refrain from sharing, distributing, or disclosing any part of the information to any third party.

• Non-Tampering: You shall not tamper with, disrupt, or attempt to compromise any

Affordmed or its vendor's cloud or software resources provided for this assessment.

• Sole Use: You shall use this material solely for the purpose stated herein and for no other

purpose whatsoever.

Any unauthorised use, disclosure, or tampering will result in immediate disqualification from the

candidacy process and may subject you to legal action. You consent to the exclusive jurisdiction

of the Courts of Hyderabad/Secunderabad for any legal disputes arising from this agreement.

Any reference to third parties within this document is purely coincidental and for illustrative

purposes only, and does not constitute any endorsement or affiliation.

Submission Guidelines

• Create a Public Repository on your Github Account with your Roll Number as

the Repository Name

• For Full Stack track, create the following inside the repository

• logging middleware folder

• notification_system_design.md (as markdown file)

• notification_app_be folder

o notification_app_fe folder

Afford Medical Technologies Private Limited

B 230 2nd Main Road, Sainikpuri, Hyderabad-500094, Telangana, INDIA. Phone: 91-40-27117068/27116133,|

Web: www.affordmed.com, E-mail: contact@affordmed.com, CIN: U72200TG2007PTC056067, URN: UDYAM-TS-20-0013532Some tools might be unavailable due to heavy traffic in this file.

Try again

Dilemiss

AFFORDMED®

Technology, Innovation & fordability

o gitignore (add node_modules if js/ts is used)

• For Backend track, create the following inside the repository

• logging middleware folder

• vehicle_maintence_scheduler folder

• notification_system_design.md (as markdown file)

• notification_app_be folder

o gitignore (add node_modules if js/ts is used)

• For Frontend tracks, create the following inside the repository

• logging middleware folder

• notification_system_design.md (as markdown file)

• notification_app_be folder

• notification_app_fe folder

• gitignore (add node_modules if js/ts is used)

• Ensure that your Name, or any mention of Affordmed, is entirely absent from

the Repository Name, the README file, and all commit messages.

• For each question, submit comprehensive solutions. This includes

your

architecture design,

complete code and clear output screenshots. Incomplete

submissions will not be considered for evaluation.

• We strongly encourage you to commit and push your code to GitHub regularly,

at logical milestones in your development process.

• Please adhere to production-grade coding standards. This includes employing

proper naming conventions, maintaining a well-organised folder structure, and

providing appropriate comments within your code to enhance readability. This

is only an indicative list and you are encouraged to demonstrate other best

practices that you are aware of.

• For Backend Track or the Backend question of Full Stack Track, select any

Backend Framework without utilising external libraries for algorithms. Capture

output screenshots from API clients like Insomnia or Postman, displaying

request body, response and response time for the problem. The output

screenshots have to be taken of API calls to your app and not the test server

• For Frontend Track or the Frontend question of Full Stack Track, it is mandatory

to use React or Next. While JavaScript is permitted, the use of TypeScript is

Afford Medical Technologies Private Limited

B 230 2nd Main Road, Sainikpuri, Hyderabad-500094, Telangana, INDIA. Phone: 91-40-27117068/27116133,

Wen: wwwafnrdmer.com --malcontart@afordmer com ٢٨- 73200762007976956067 09N-0343-75-30-0013532Some tools might be unavailable due to heavy traffic in this file. Try again Learn more

Diemiss

AFFORDMED

Technology, Inovation & fordability

preferred. Capture output screenshots of both mobile and desktop views of

your web application. For styling, only Material Ul or Vanilla CSS are permitted.

• Any instance of plagiarism, including using another applicant's API credentials,

LLMs will lead to immediate rejection.

Registration

You need to register with our Test Server to obtain your unique Client ID and

Client Secret.

Requirements:

• Your Roll Number and Email, must align with your university/college email and

roll number. (Email must support Google Form verified submission)

• The GitHub Repository link you submit in the Google Form will be matched

against the GitHub Username provided during registration. Any mismatch will

result in your submission being ignored. If your GitHub Profile link is

https://github.com/username, submit only username while Registering.

• The accessCode required for registration has been shared via the email you

received. Do not use the example accessCode provided below.

Registration API (POST)

http://20.207.122.201/evaluation-service/register

Request Body

"email": "ramkrishna@abc.edu",

"name": "Ram Krishna",

"mobileNo": "9999999999",

"githubusername": "github",

"rollNo": "aa1bb",

"accessCode": "xgAsNC"

Afford Medical Technologies Private Limited

B 230 2nd Main Road, Sainikpuri, Hyderabad-500094, Telangana, INDIA. Phone: 91-40-27117068/27116133,

Web: www.affordmed.com, E-mail: contact@affordmed.com, CIN: U72200TG2007PTC056067, URN: UDYAM-TS-20-0013532Some tools might be unavailable due to heavy traffic in this file. Try again Learn more

Diemiss

AFFORDMED

Technology, Innovation & fordability

Response

You can register only once. Do not forget to save your clientID and clientSecret; you cannot

retrieve them again.

"email': "ramkrishna@abc.edu",

"name": "ram krishna",

"rollNo": "aalbb",

"accessCode": "xgAsNC",

ClientIDi:d9cbb699-6a2-44a5-8059-8b1befa816da',

"clientSecret": "tWJaaaRBSeXcRXeM"

Authentication

After successful registration, you must obtain an Authorization Token to access the Test Server APls.

Authorization Token API (POST)

http://20.207.122.201/evaluation-service/auth

Request Body

{

"email': "ramkrishna@abc.edu",

"rollNo": "aalbb",

"accessCode": "xgAsNC",

"clientID": "d9cbb699-6a27-44a5-8d59-8b1befa816da",

"clientSecret": "tVJaaaRBSeXcRXeM"

Response: (Status Code: 200)

"token type": "Bearer",

Afford Medical Technologies Private Limited

R 237 2no wan Road santcour uceranar-590094 Toanoana NOa Bhone: 91-40-27777058127175183

wen' wwatarmedommaحصون اsaaمهوه comه:7720075s70zPICssu57 e IIvAva5-20-11113532Web: www.affordmed.com, E-mail: contact@affordmed.com, CIN: U72200TG2007PTC056067, URN: UDYAM-TS-20-0013532|

Some tools might be unavailable due to heavy traffic in this file.

Try again Learn more

Diemiss

AFFORDMED®

Technology, Inovation & fordability

"access_token" :

"eyJhbGci0iJIUZI1NiIsInR5cCI61kpXVCJ9.eyJNYXBDbGFpbXMi0nsiZXhwIj0xNzQzNTcØMzQ0L

СJpYXQiOjEЗNDM1NzQwNDQsImlzсyI6IkFmZm9yZG11ZCIsImp0aSI6ImQ5Y2JiNjk5LTZhMjctNDRh

NS04ZDU5LThiMWJ1ZmE4MTZkYSIsInN1YiI6InJhbWtyaXNobmFAYWJjLmVkdSJ9LCJ1bWFpbCI6In]

hbwtyaXNobmFAYWJjLmVkdSIsIm5hbWU10iJyYW0ga3Jpc2huYSIsInJvbGx0byI6ImFhMwJiIiwiw

NjZХNzQ29kZSI6InhnQХN0QyIsImNsaWVudE1EIjoiZD1jYmI20TktNmEyNyØ0NGE1LThkNTktOGIxY

mVmYТgxNmRhIiwiY2xpZw5@U2VjcmV0IjoidFZKYWFhUkJTZVhjU1hITSJ9.YApD98gqØIN_0Ww7JMf

muUfK1m4hLTm7AIcLDcLAzVg",

"expires in": 1743574344

Develop Logging Middleware

The 'Logging Middleware' is a critical component for building robust and observable

applications. While error logging is essential, we expect you to implement logging that captures

the entire lifecycle of significant events within your application - from successful operations to

warnings, informational messages, and debugging details. Think of logs as the narrative of your

application's execution! These logs are crucial for understanding application

performance, and for effective debugging.

Note: While you have flexibility in choosing your backend language/framework, the Logging

iddleware must be a reusable package. If attempting the Full Stack track, both this middlewa

id your backend application must be developed in TypeScript/JavaScript to enable t

logging package's consumption by the Frontend.

Write a reusable function that makes an API call to the Test Server each time the function is

called that matches the below structure:

Log(stack, level, package, message)

Integrate this reusable Log function strategically throughout your codebase. Each Log call

should provide specific and descriptive context about what's happening. Instead of generic

messages, aim for logs that clearly communicate the state, actions, and any relevant data at that

point in the code.

We encourage you to think critically about what information would be most valuable if you were

to troubleshoot your application months from now. That's the information you should be

logging!

Afford Medical Technologies Private Limited

B 230 2nd Main Road, Sainikpuri, Hyderabad-500094, Telangana, INDIA. Phone: 91-40-27117068/27116133,

Web: www.affordmed.com.E-mail: contact@affordmed.com. CIN: U72200TG2007PTC056067. URN: UDYAM-T5-20-00135=Some tools might be unavailable due to heavy traffic in this file. Try again Learn more

AFFORDMED

Diamiss

Technology, Innovation & fordability

|/ If an error occurs in your application's handler due to a data type mismatch

Log ("backend", "error", "handler", "received string, expected bool")

// If an error occurs in your application's db Layer

Log("backend", "fatal", "db", "Critical database connection failure."›

The test server has the below API that you can call in your Logging Middleware

Log API (POST)

http://20.207.122.201/evaluation-service/logs

Constraints

: Sack, Levol and Package Fields accept only the following values (in lower case only)

Stack

"backend"

"frontend"

Package

Packages that can only be used in Backend Application

"cache"

"controller"

"cron_job"

"db"

"domain"

Afford Medical Technologies Private Limited

B 230 2nd Main Road, Sainikpuri, Hyderabad-500094, Telangana, INDIA. Phone: 91-40-27117068/27116133,

Web: www.affordmed.com. E-mail: contact@affordmed.com. CIN: U72200TG2007PTC056067, URN: UDYAM-TS-20-0013532Some tools might be unavailable due to heavy traffic in this file. Try again Learn more

Dismiss

AFFORDMED®

Technology, Innovation & A fordability

"handler"

"repository"

"route"

"service"

Packages that can be only be used in Frontend Application

"api"

"component"

"hook"

"page"

"state"

"style"

Packages that can be used in both Backend and Frontend Application

"auth"

"config"

"middleware"

"utils"

Request Body

}

"stack" : "backend",

"level": "error",

"package": "handler",

"message": "received string, expected bool"

Response (Status Code: 200)

"1ogID": "a4aad02e-19d0-4153-86d9-58bf55d7c402",

"message": "log created successfully"

}

Afford Medical Technologies Private Limited

B 230 2nd Main Road, Sainikpuri, Hyderabad-500094, Telangana, INDIA. Phone: 91-40-27117068/27116133,

Web: www.affordmed.com, E-mail: contact@affordmed.com, CIN: U72200TG2007PTC056067, URN: UDYAM-TS-20-0013532