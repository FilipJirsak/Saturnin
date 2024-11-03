OPTION IMPORT;

CREATE issue_state:new CONTENT {title: "New"};
CREATE issue_state:to_do CONTENT {title: "To do"};
CREATE issue_state:in_progress CONTENT {title: "In progress"};
CREATE issue_state:done CONTENT {title: "Done"};

CREATE project:TEST1 CONTENT {
       title: "Project test 1",
       initial_issue_state: issue_state:new
    };

CREATE project:TEST2 CONTENT {
       title: "Project test 2",
       initial_issue_state: issue_state:new
};

CREATE issue:1 CONTENT {
       title: "Issue 1",
       state: issue_state:new
};

RELATE issue:1->issue_code:["TEST1", 1]->project:TEST1;

CREATE issue:2 CONTENT {
       title: "Issue 2",
       state: issue_state:new
};

RELATE issue:2->issue_code:["TEST2", 1]->project:TEST2;

CREATE issue:3 CONTENT {
       title: "Issue 3",
       state: issue_state:in_progress
};

RELATE issue:3->issue_code:["TEST1", 2]->project:TEST1;

CREATE issue:4 CONTENT {
       summary: "Issue number 4",
       state: issue_state:new
};

RELATE issue:4->issue_code:["TEST1", 3]->project:TEST1;
