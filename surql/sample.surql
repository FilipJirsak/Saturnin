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

CREATE project:RESEARCH CONTENT {
  title: "Výzkumný projekt",
  initial_issue_state: issue_state:new
};

CREATE project:DESIGN CONTENT {
  title: "Design systém",
  initial_issue_state: issue_state:to_do
};

CREATE project:KNOWLEDGE CONTENT {
  title: "Znalostní báze",
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

CREATE issue:5 CONTENT {
  title: "Rešerše konkurence",
  summary: "Analyzovat podobné systémy a jejich řešení",
  state: issue_state:in_progress
};

RELATE issue:5->issue_code:["RESEARCH", 1]->project:RESEARCH;

CREATE issue:6 CONTENT {
  title: "Návrh designu komponent",
  state: issue_state:to_do
};

RELATE issue:6->issue_code:["DESIGN", 1]->project:DESIGN;

CREATE issue:7 CONTENT {
  title: "Vytvoření struktury znalostní báze",
  state: issue_state:new
};

RELATE issue:7->issue_code:["KNOWLEDGE", 1]->project:KNOWLEDGE;

CREATE issue:8 CONTENT {
  title: "Testování API endpointů",
  summary: "Otestovat všechny nově vytvořené API endpointy",
  state: issue_state:new
};

RELATE issue:8->issue_code:["RESEARCH", 2]->project:RESEARCH;
