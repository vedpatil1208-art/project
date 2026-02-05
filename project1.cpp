#include <iostream>
#include <fstream>
using namespace std;


struct Student {
    string name;
    string cohort;   
    int roll;
    int score;
};


struct Question {
    string question;
    string optionA;
    string optionB;
    string optionC;
    string optionD;
    char correct;
};


void saveResult(Student s) {
    ofstream file("results.txt", ios::app);
    file << "Name: " << s.name << endl;
    file << "Cohort: " << s.cohort << endl;   // NEW
    file << "Roll No: " << s.roll << endl;
    file << "Score: " << s.score << "/5" << endl;
    file << "----------------------------" << endl;
    file.close();
}

int main() {
    Student s;
    Question q[5];
    char answer;
    char userAnswers[5];

    cout << "Enter Student Name: ";
    getline(cin, s.name);

    cout << "Enter Cohort : ";
    getline(cin, s.cohort);   // NEW

    cout << "Enter Roll Number: ";
    cin >> s.roll;

    s.score = 0;

    q[0] = {"What is C++?", "A) Programming Language", "B) Game", "C) OS", "D) Browser", 'A'};
    q[1] = {"Which symbol is used for comments?", "A) //", "B) #", "C) /*", "D) $", 'A'};
    q[2] = {"Which loop runs at least once?", "A) for", "B) while", "C) do-while", "D) if", 'C'};
    q[3] = {"Which keyword defines a structure?", "A) class", "B) struct", "C) define", "D) array", 'B'};
    q[4] = {"Which file handles output?", "A) ifstream", "B) cin", "C) ofstream", "D) cout", 'C'};

    cout << "\n--- Online Examination Started ---\n";
   
    for (int i = 0; i < 5; i++) {
        cout << "\nQ" << i + 1 << ": " << q[i].question << endl;
        cout << q[i].optionA << endl;
        cout << q[i].optionB << endl;
        cout << q[i].optionC << endl;
        cout << q[i].optionD << endl;

        cout << "Enter your answer (A/B/C/D): ";
        cin >> answer;

        if (answer >= 'a' && answer <= 'z') {
            answer = answer - 32;
        }

        userAnswers[i] = answer;
    }

    for (int i = 0; i < 5; i++) {
        if (userAnswers[i] == q[i].correct) {
            s.score++;
        }
    }
    
    cout << "\n--- Exam Completed ---" << endl;
    cout << "Name: " << s.name << endl;
    cout << "Cohort: " << s.cohort << endl;   // NEW
    cout << "Your Score: " << s.score << "/5" << endl;

    cout << "\n--- Answer Summary ---\n";
    for (int i = 0; i < 5; i++) {
        cout << "Q" << i + 1 << ": ";
        if (userAnswers[i] == q[i].correct) {
            cout << "Right ✔️" << endl;
        } else {
            cout << "Wrong ❌ (Correct: " << q[i].correct << ")" << endl;
        }
    }

 
    saveResult(s);
    cout << "\nResult saved successfully!" << endl;

    return 0;
}
