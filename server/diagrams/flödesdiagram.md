```mermaid
flowchart LR
    A([Klient anropar<br>POST /submit-answer/:id]) --> B[requireUser]
    B --> C{Aktiv session?}
    C -- Nej --> D([400 No active session])
    C -- Ja --> E[scenariosRouter]
    E --> F[ScenariosService.submitAnswer]
    F --> G{Aktiv ScenarioManager<br>för userId?}
    G -- Nej --> H([404 No active scenario])
    G -- Ja --> I{Stämmer <br> scenarioId?}
    I -- Nej --> J([404 Scenario not found])
    I -- Ja --> K[ScenarioManager.submitAnswer]
    K --> L[Skapar UserTurn-objekt<br>och lägger till i historik]
    L --> M[TurnManager.startGenerateFeedback <br> startar asynkront]
    M --> N[200 UserTurn returneras<br>till klient]
    M -.-> O[TurnManager.generateFeedback uppdaterar UserTurn när den är klar och hämtas sedan av klienten via GET /get-feedback/:userTurnId]
```

```mermaid
    flowchart LR
        O[TurnManager.generateFeedback]
        O --> P[Hämtar förväntat svar\nfrån scenarioIndex]
        P --> Q[controlUserMessage]
        Q --> R[parseMessage]
        R --> S[controlOpening]
        S --> T{Behövs\nstavningskontroll?}
        T -- Ja --> U[OpenAILLMService\n.correctSpelling]
        T -- Nej --> V[controlContent]
        U --> V
        V --> W{Behövs\nbetydelsejämförelse?}
        W -- Ja --> X[OpenAILLMService\n.compareMeaning]
        W -- Nej --> Y[controlEnding]
        X --> Y
        Y --> Z[Räknar ihop errorCounter]
        Z --> AA[Sätter AnswerAccuracy\nCorrect / PartiallyCorrect / Incorrect]
        AA --> AB[Promise löses med\nUserTurn + feedback]
    end
```