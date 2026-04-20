interface Content {
  marker?: MessageMarkers;
  message: string;
}

export enum MessageEnding {
  OVER = "over",
  OUT = "out",
}

//Not used yet, but would probably like to use for a refactor later
export interface MaritimeMessage {
  opening?: string;
  content?: Content[];
  ending?: string;
}

export enum MessageMarkers {
  INFORMATION = "information",
  TRAFFIC_INFORMATION = "traffic information",
  ADVICE = "advice",
  WARNING = "warning",
  INSTRUCTION = "instruction",
  QUESTION = "question",
  ANSWER = "answer",
  REQUEST = "request",
  INTENTION = "intention",
}

export enum PhoneticAlphabet {
  ALHPA = "alpha",
  BRAVO = "bravo",
  CHARLIE = "charlie",
  DELTA = "delta",
  ECHO = "echo",
  FOXTROT = "foxtrot",
  GOLF = "golf",
  HOTEL = "hotel",
  INDIA = "india",
  JULIET = "juliet",
  KILO = "kilo",
  LIMA = "lima",
  MIKE = "mike",
  NOVEMBER = "november",
  OSCAR = "oscar",
  PAPA = "papa",
  QUEBEC = "quebec",
  ROMEO = "romeo",
  SIERRA = "sierra",
  TANGO = "tango",
  UNIFORM = "uniform",
  VICTOR = "victor",
  WHISKEY = "whiskey",
  XRAY = "x-ray",
  YANKEE = "yankee",
  ZULU = "zulu",
  ZERO = "zero",
  ONE = "one",
  TWO = "two",
  THREE = "three",
  FOUR = "four",
  FIVE = "five",
  SIX = "six",
  SEVEN = "seven",
  EIGHT = "eight",
  NINE = "nine",
  DECIMAL = "decimal",
}

export enum AmbiguesWords {
  MAY = "may",
  MIGHT = "might",
  COULD = "could",
  SHOULD = "should",
  CAN = "can",
}
