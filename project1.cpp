#include <iostream>
#include <string>
using namespace std;

class Question {
public:
    string qText;
    string options[4];
    char correctAns;

    // Simple function to fill the question data
    void fillData(string t, string o1, string o2, string o3, string o4, char ans) {
        qText = t;
        options[0] = o1;
        options[1] = o2;
        options[2] = o3;
        options[3] = o4;
        correctAns = ans;
    }

    // Simple function to show the question
    void show() {
        cout << "\n" << qText << endl;
        cout << "A. " << options[0] << "\nB. " << options[1] << endl;
        cout << "C. " << options[2] << "\nD. " << options[3] << endl;
    }
};
class Exam {
public:
    int score;

    int runTest(Question qArray[]) {
        score = 0;
        char userAns;

        for (int i = 0; i < 5; i++) {
            qArray[i].show(); // Show question from Student 1
            cout << "Enter Choice (A/B/C/D): ";
            cin >> userAns;

            // Simple if-else to check answer
            if (userAns == qArray[i].correctAns || userAns == (qArray[i].correctAns + 32)) {
                cout << "Correct!\n";
                score = score + 1;
            } else {
                cout << "Wrong! The answer was " << qArray[i].correctAns << endl;
            }
        }
        return score;
    }
};
class Result {
public:
    string name;
    string cohort;
    string rollNo;
    int marks;

    void display() {
        cout << name << " | " << cohort << " | " << rollNo << " | Score: " << marks << "/5" << endl;
    }
};

int main() {
    Question bank[5];
    Exam myExam;
    Result studentRecords[10]; // Array to store results of 10 students
    int totalStudents = 0;
    int menuChoice;

    // Setting up the 5 questions
    bank[0].fillData("Size of int in C++?", "2 bytes", "4 bytes", "1 byte", "8 bytes", 'B');
    bank[1].fillData("Which is used for input?", "cout", "cin", "printf", "get", 'B');
    bank[2].fillData("C++ is a ___ language.", "Low level", "High level", "Script", "None", 'B');
    bank[3].fillData("Which loop is best for fixed iterations?", "while", "do-while", "for", "if", 'C');
    bank[4].fillData("Symbol for end of statement?", ":", ",", ".", ";", 'D');

    while (true) {
        cout << "\n1. Start Exam\n2. View All Results\n3. Exit\nChoice: ";
        cin >> menuChoice;

        if (menuChoice == 1) {
            cout << "Enter Name: "; cin >> studentRecords[totalStudents].name;
            cout << "Enter Cohort: "; cin >> studentRecords[totalStudents].cohort;
            cout << "Enter Roll No: "; cin >> studentRecords[totalStudents].rollNo;

            studentRecords[totalStudents].marks = myExam.runTest(bank);
            totalStudents++; 
        } 
        else if (menuChoice == 2) {
            cout << "\n--- SCOREBOARD ---\n";
            for (int i = 0; i < totalStudents; i++) {
                studentRecords[i].display();
            }
        } 
        else {
            break;
        }
    }
    return 0;
}
