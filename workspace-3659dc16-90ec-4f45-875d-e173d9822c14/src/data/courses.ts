/**
 * Lingoland content catalog.
 * 3 languages (Spanish, Japanese, French), each with multiple units and lessons.
 * All content is original — written specifically for Lingoland.
 *
 * The exercise engine consumes ExerciseSpec objects; lessons are lists of specs.
 */

export type ExerciseType =
  | "multiple_choice"
  | "translation"
  | "word_order"
  | "fill_blank"
  | "matching"
  | "listening"
  | "speaking"
  | "image_select"
  | "dialogue"
  | "spell"
  | "true_false";

export interface ExerciseSpec {
  id: string;
  type: ExerciseType;
  /** Translation direction: "to_target" (translate INTO target language) | "to_native" | "listen" | "see" */
  prompt: string;
  promptTranslation?: string;
  instruction?: string;
  /** For multiple_choice, image_select, true_false */
  options?: string[];
  optionTranslations?: string[];
  /** Index(es) of correct option(s) for MC/image/true_false */
  correctIndex?: number | number[];
  /** For word_order — tokens to arrange */
  tokens?: string[];
  tokensTranslation?: string;
  /** Correct token order (as joined string for comparison) */
  correctOrder?: string;
  /** For fill_blank — sentence with __BLANK__ */
  sentence?: string;
  blankAnswer?: string;
  /** For matching — pairs */
  pairs?: { left: string; right: string }[];
  /** For listening */
  audioText?: string;
  /** For speaking */
  targetPhrase?: string;
  /** Hint shown after wrong answer */
  hint?: string;
  /** Explanation shown after answering */
  explanation?: string;
  /** Image url for image_select (we use emoji proxy for offline) */
  images?: string[]; // emoji
  correctImageIndex?: number;
  /** Reward */
  xp?: number;
}

export interface VocabItem {
  word: string;
  translation: string;
  pronunciation?: string;
  partOfSpeech?: string;
  example?: string;
  exampleTranslation?: string;
  difficulty?: number;
  emoji?: string;
}

export interface LessonSpec {
  id: string;
  title: string;
  description: string;
  type: "lesson" | "story" | "practice" | "challenge" | "review" | "speaking";
  xp: number;
  vocab?: VocabItem[];
  exercises: ExerciseSpec[];
  isBonus?: boolean;
}

export interface UnitSpec {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  lessons: LessonSpec[];
}

export interface CourseSpec {
  id: string;
  languageId: string;
  title: string;
  description: string;
  iconColor: string;
  units: UnitSpec[];
}

export interface LanguageSpec {
  id: string;
  name: string;
  nativeName: string;
  flag: string; // emoji
  bcp47: string;
}

export const LANGUAGES: LanguageSpec[] = [
  { id: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", bcp47: "es-ES" },
  { id: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", bcp47: "ja-JP" },
  { id: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", bcp47: "fr-FR" },
];

// ─────────────────────────────────────────────────────────────────
// SPANISH
// ─────────────────────────────────────────────────────────────────
const spanishUnit1: UnitSpec = {
  id: "es-u1",
  title: "Unit 1",
  subtitle: "Hola, ¿cómo estás?",
  description: "Greet people, say your name, and count to ten.",
  color: "#58cc8d",
  lessons: [
    {
      id: "es-u1-l1",
      title: "Greetings",
      description: "Say hello and goodbye in Spanish.",
      type: "lesson",
      xp: 10,
      vocab: [
        { word: "hola", translation: "hello", pronunciation: "OH-lah", emoji: "👋" },
        { word: "adiós", translation: "goodbye", pronunciation: "ah-DYOHS", emoji: "👋" },
        { word: "buenos días", translation: "good morning", pronunciation: "BWEH-nohs DEE-ahs", emoji: "🌅" },
        { word: "buenas noches", translation: "good night", pronunciation: "BWEH-nahs NOH-chehs", emoji: "🌙" },
      ],
      exercises: [
        {
          id: "e1",
          type: "multiple_choice",
          prompt: "How do you say 'hello' in Spanish?",
          instruction: "Choose the correct translation",
          options: ["hola", "adiós", "gracias", "por favor"],
          correctIndex: 0,
          explanation: "'Hola' is the standard greeting in Spanish, used any time of day.",
          xp: 2,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate this sentence",
          promptTranslation: "Good morning",
          instruction: "Translate to Spanish",
          tokens: ["buenos", "días", "noches", "buenas"],
          correctOrder: "buenos días",
          explanation: "'Buenos días' is used before noon. Afternoon uses 'buenas tardes'.",
          xp: 2,
        },
        {
          id: "e3",
          type: "image_select",
          prompt: "Which image means 'good night'?",
          instruction: "Tap the matching image",
          images: ["🌅", "🌙", "👋", "☀️"],
          correctImageIndex: 1,
          promptTranslation: "buenas noches",
          explanation: "'Buenas noches' (good night) is associated with the moon.",
          xp: 2,
        },
        {
          id: "e4",
          type: "matching",
          prompt: "Match the Spanish greetings to their meanings",
          instruction: "Tap a left item, then tap its match on the right",
          pairs: [
            { left: "hola", right: "hello" },
            { left: "adiós", right: "goodbye" },
            { left: "buenos días", right: "good morning" },
            { left: "buenas noches", right: "good night" },
          ],
          xp: 2,
        },
        {
          id: "e5",
          type: "listening",
          prompt: "Tap what you hear",
          instruction: "Listen and choose what was said",
          audioText: "hola",
          options: ["hola", "ola", "hola adiós", "buenos"],
          correctIndex: 0,
          explanation: "The Spanish 'h' is silent — 'hola' sounds like 'OH-lah'.",
          xp: 2,
        },
        {
          id: "e6",
          type: "speaking",
          prompt: "Say this phrase",
          instruction: "Speak the phrase aloud",
          targetPhrase: "buenos días",
          promptTranslation: "good morning",
          hint: "BWEH-nohs DEE-ahs",
          xp: 2,
        },
        {
          id: "e7",
          type: "fill_blank",
          prompt: "Complete the sentence",
          sentence: "¡___ días! ¿Cómo estás?",
          blankAnswer: "buenos",
          instruction: "Type the missing word",
          hint: "Used before noon",
          explanation: "Before noon we say 'buenos días'.",
          xp: 2,
        },
        {
          id: "e8",
          type: "word_order",
          prompt: "Arrange the words",
          instruction: "Tap the words in the correct order",
          tokens: ["noches", "buenas", "—", "¡", "!"],
          correctOrder: "¡buenas noches!",
          tokensTranslation: "good night",
          xp: 2,
        },
      ],
    },
    {
      id: "es-u1-l2",
      title: "Introductions",
      description: "Tell people your name and ask theirs.",
      type: "lesson",
      xp: 10,
      vocab: [
        { word: "me llamo", translation: "my name is", pronunciation: "meh YAH-moh", emoji: "🪪" },
        { word: "¿cómo te llamas?", translation: "what's your name?", pronunciation: "KOH-moh teh YAH-mahs", emoji: "❓" },
        { word: "mucho gusto", translation: "nice to meet you", pronunciation: "MOO-choh GOO-stoh", emoji: "🤝" },
        { word: "soy de", translation: "I'm from", pronunciation: "soy deh", emoji: "📍" },
      ],
      exercises: [
        {
          id: "e1",
          type: "multiple_choice",
          prompt: "How do you say 'my name is' in Spanish?",
          instruction: "Choose the correct translation",
          options: ["me llamo", "te llamas", "mucho gusto", "adiós"],
          correctIndex: 0,
          explanation: "'Me llamo' (literally: I call myself) is how Spanish speakers introduce themselves.",
          xp: 2,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate this sentence",
          promptTranslation: "Nice to meet you",
          instruction: "Translate to Spanish",
          tokens: ["mucho", "gusto", "muy", "bueno"],
          correctOrder: "mucho gusto",
          xp: 2,
        },
        {
          id: "e3",
          type: "dialogue",
          prompt: "Lumo says: ¿Cómo te llamas?",
          promptTranslation: "What's your name?",
          instruction: "Choose the most natural reply",
          options: ["Me llamo Ana", "Buenos días", "Adiós", "Gracias"],
          correctIndex: 0,
          explanation: "The natural reply is to state your name with 'Me llamo ___'.",
          xp: 2,
        },
        {
          id: "e4",
          type: "fill_blank",
          prompt: "Complete: I'm from Spain",
          sentence: "Soy ___ España.",
          blankAnswer: "de",
          instruction: "Type the missing word",
          hint: "Preposition meaning 'from' or 'of'",
          xp: 2,
        },
        {
          id: "e5",
          type: "matching",
          prompt: "Match the phrases",
          instruction: "Pair Spanish with English",
          pairs: [
            { left: "me llamo", right: "my name is" },
            { left: "¿cómo te llamas?", right: "what's your name?" },
            { left: "mucho gusto", right: "nice to meet you" },
            { left: "soy de", right: "I'm from" },
          ],
          xp: 2,
        },
        {
          id: "e6",
          type: "speaking",
          prompt: "Say your introduction",
          targetPhrase: "me llamo",
          promptTranslation: "my name is",
          hint: "meh YAH-moh",
          xp: 2,
        },
        {
          id: "e7",
          type: "word_order",
          prompt: "Arrange the words",
          instruction: "Form the question",
          tokens: ["llamas", "te", "cómo", "¿", "?"],
          correctOrder: "¿cómo te llamas?",
          tokensTranslation: "what's your name?",
          xp: 2,
        },
      ],
    },
    {
      id: "es-u1-l3",
      title: "Numbers 1–10",
      description: "Count to ten in Spanish.",
      type: "lesson",
      xp: 10,
      vocab: [
        { word: "uno", translation: "one", emoji: "1️⃣" },
        { word: "dos", translation: "two", emoji: "2️⃣" },
        { word: "tres", translation: "three", emoji: "3️⃣" },
        { word: "cuatro", translation: "four", emoji: "4️⃣" },
        { word: "cinco", translation: "five", emoji: "5️⃣" },
        { word: "diez", translation: "ten", emoji: "🔟" },
      ],
      exercises: [
        {
          id: "e1",
          type: "image_select",
          prompt: "Which image represents 'cinco'?",
          instruction: "five",
          images: ["3️⃣", "5️⃣", "10️⃣", "1️⃣"],
          correctImageIndex: 1,
          promptTranslation: "cinco",
          xp: 2,
        },
        {
          id: "e2",
          type: "multiple_choice",
          prompt: "What is 'diez' in English?",
          options: ["five", "ten", "two", "three"],
          correctIndex: 1,
          xp: 2,
        },
        {
          id: "e3",
          type: "fill_blank",
          prompt: "Complete: 4 = ___",
          sentence: "cuatro = ___",
          blankAnswer: "four",
          instruction: "Type the English translation",
          xp: 2,
        },
        {
          id: "e4",
          type: "matching",
          prompt: "Match the numbers",
          pairs: [
            { left: "uno", right: "1" },
            { left: "dos", right: "2" },
            { left: "tres", right: "3" },
            { left: "diez", right: "10" },
          ],
          xp: 2,
        },
        {
          id: "e5",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "five",
          tokens: ["cinco", "cuatro", "diez", "seis"],
          correctOrder: "cinco",
          xp: 2,
        },
        {
          id: "e6",
          type: "listening",
          prompt: "Tap what you hear",
          audioText: "tres",
          options: ["tres", "diez", "dos", "seis"],
          correctIndex: 0,
          xp: 2,
        },
      ],
    },
    {
      id: "es-u1-l4",
      title: "Story: First Day in Madrid",
      description: "Use greetings in context.",
      type: "story",
      xp: 15,
      exercises: [
        {
          id: "e1",
          type: "dialogue",
          prompt: "A stranger approaches: ¡Hola! ¿Cómo te llamas?",
          promptTranslation: "Hi! What's your name?",
          instruction: "How would you reply?",
          options: ["Me llamo María", "Adiós", "Buen provecho", "Cuánto cuesta"],
          correctIndex: 0,
          explanation: "Introduce yourself with 'Me llamo ___'.",
          xp: 5,
        },
        {
          id: "e2",
          type: "multiple_choice",
          prompt: "In the story, the barista says 'buenos días'. What time of day is it?",
          options: ["morning", "afternoon", "evening", "night"],
          correctIndex: 0,
          explanation: "'Buenos días' is used in the morning.",
          xp: 5,
        },
        {
          id: "e3",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "Nice to meet you too",
          tokens: ["igualmente", "mucho", "gusto", "también"],
          correctOrder: "igualmente",
          explanation: "'Igualmente' means 'likewise' or 'you too'.",
          xp: 5,
        },
      ],
    },
    {
      id: "es-u1-l5",
      title: "Review",
      description: "Refresh everything from Unit 1.",
      type: "review",
      xp: 12,
      exercises: [
        {
          id: "e1",
          type: "matching",
          prompt: "Match these Unit 1 phrases",
          pairs: [
            { left: "hola", right: "hello" },
            { left: "adiós", right: "goodbye" },
            { left: "me llamo", right: "my name is" },
            { left: "cinco", right: "five" },
          ],
          xp: 3,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "good night",
          tokens: ["buenas", "noches", "días", "buenos"],
          correctOrder: "buenas noches",
          xp: 3,
        },
        {
          id: "e3",
          type: "fill_blank",
          prompt: "Complete: My name ___ Ana.",
          sentence: "Me ___ Ana.",
          blankAnswer: "llamo",
          hint: "From the verb 'llamarse'",
          xp: 3,
        },
        {
          id: "e4",
          type: "listening",
          prompt: "Tap what you hear",
          audioText: "adiós",
          options: ["adiós", "hola", "buenos", "noches"],
          correctIndex: 0,
          xp: 3,
        },
      ],
    },
  ],
};

const spanishUnit2: UnitSpec = {
  id: "es-u2",
  title: "Unit 2",
  subtitle: "Family & Friends",
  description: "Talk about your family and closest people.",
  color: "#4d96ff",
  lessons: [
    {
      id: "es-u2-l1",
      title: "Family members",
      description: "Mother, father, sister, brother.",
      type: "lesson",
      xp: 10,
      vocab: [
        { word: "madre", translation: "mother", emoji: "👩" },
        { word: "padre", translation: "father", emoji: "👨" },
        { word: "hermana", translation: "sister", emoji: "👧" },
        { word: "hermano", translation: "brother", emoji: "👦" },
        { word: "familia", translation: "family", emoji: "👨‍👩‍👧‍👦" },
      ],
      exercises: [
        {
          id: "e1",
          type: "image_select",
          prompt: "Which image means 'madre'?",
          images: ["👨", "👩", "👧", "👦"],
          correctImageIndex: 1,
          promptTranslation: "madre",
          xp: 2,
        },
        {
          id: "e2",
          type: "multiple_choice",
          prompt: "How do you say 'brother'?",
          options: ["hermana", "hermano", "padre", "madre"],
          correctIndex: 1,
          xp: 2,
        },
        {
          id: "e3",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "my family",
          tokens: ["mi", "familia", "familias", "mio"],
          correctOrder: "mi familia",
          xp: 2,
        },
        {
          id: "e4",
          type: "fill_blank",
          prompt: "Complete: My sister is funny.",
          sentence: "Mi ___ es divertida.",
          blankAnswer: "hermana",
          hint: "Female sibling",
          xp: 2,
        },
        {
          id: "e5",
          type: "matching",
          prompt: "Match",
          pairs: [
            { left: "madre", right: "mother" },
            { left: "padre", right: "father" },
            { left: "hermana", right: "sister" },
            { left: "hermano", right: "brother" },
          ],
          xp: 2,
        },
        {
          id: "e6",
          type: "listening",
          prompt: "Tap what you hear",
          audioText: "familia",
          options: ["familia", "padre", "madre", "amigo"],
          correctIndex: 0,
          xp: 2,
        },
      ],
    },
    {
      id: "es-u2-l2",
      title: "Possessives",
      description: "mi, tu, su — my, your, their.",
      type: "lesson",
      xp: 10,
      exercises: [
        {
          id: "e1",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "my mother",
          tokens: ["mi", "madre", "tu", "padre"],
          correctOrder: "mi madre",
          xp: 2,
        },
        {
          id: "e2",
          type: "multiple_choice",
          prompt: "Which means 'your brother'?",
          options: ["tu hermano", "mi hermano", "su hermana", "el hermano"],
          correctIndex: 0,
          explanation: "'tu' is the informal 'your'.",
          xp: 2,
        },
        {
          id: "e3",
          type: "fill_blank",
          prompt: "Complete: ___ father is tall.",
          sentence: "___ padre es alto.",
          blankAnswer: "mi",
          instruction: "Type the possessive",
          xp: 2,
        },
        {
          id: "e4",
          type: "matching",
          prompt: "Match",
          pairs: [
            { left: "mi", right: "my" },
            { left: "tu", right: "your" },
            { left: "su", right: "his/her/their" },
            { left: "nuestro", right: "our" },
          ],
          xp: 2,
        },
        {
          id: "e5",
          type: "speaking",
          prompt: "Say this",
          targetPhrase: "mi familia",
          promptTranslation: "my family",
          xp: 2,
        },
      ],
    },
    {
      id: "es-u2-l3",
      title: "Challenge: Family Quiz",
      description: "Test your family vocabulary.",
      type: "challenge",
      xp: 20,
      exercises: [
        {
          id: "e1",
          type: "true_false",
          prompt: "'Hermana' means 'brother'.",
          options: ["True", "False"],
          correctIndex: 1,
          explanation: "'Hermana' is sister; 'hermano' is brother.",
          xp: 5,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate fast!",
          promptTranslation: "my father",
          tokens: ["mi", "padre", "madre", "tu"],
          correctOrder: "mi padre",
          xp: 5,
        },
        {
          id: "e3",
          type: "image_select",
          prompt: "Which is 'familia'?",
          images: ["👩", "👨", "👨‍👩‍👧‍👦", "👧"],
          correctImageIndex: 2,
          xp: 5,
        },
        {
          id: "e4",
          type: "fill_blank",
          prompt: "Complete: my sister",
          sentence: "mi ___",
          blankAnswer: "hermana",
          xp: 5,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// JAPANESE
// ─────────────────────────────────────────────────────────────────
const japaneseUnit1: UnitSpec = {
  id: "ja-u1",
  title: "Unit 1",
  subtitle: "はじめまして — Nice to meet you",
  description: "Greetings, bowing, and self-introductions in Japanese.",
  color: "#ff6b6b",
  lessons: [
    {
      id: "ja-u1-l1",
      title: "Greetings",
      description: "konnichiwa, sayounara, arigatou.",
      type: "lesson",
      xp: 10,
      vocab: [
        { word: "こんにちは", translation: "hello (daytime)", pronunciation: "kon-nee-chee-wah", emoji: "👋" },
        { word: "さようなら", translation: "goodbye", pronunciation: "sa-yoh-nah-rah", emoji: "👋" },
        { word: "ありがとう", translation: "thank you", pronunciation: "ah-ree-gah-toh", emoji: "🙏" },
        { word: "すみません", translation: "excuse me / sorry", pronunciation: "soo-mee-mah-sen", emoji: "🙇" },
        { word: "おはよう", translation: "good morning (casual)", pronunciation: "oh-hah-yoh", emoji: "🌅" },
      ],
      exercises: [
        {
          id: "e1",
          type: "multiple_choice",
          prompt: "How do you say 'thank you' in Japanese?",
          options: ["ありがとう", "こんにちは", "さようなら", "すみません"],
          correctIndex: 0,
          explanation: "'Arigatou' is the casual 'thank you'; 'arigatou gozaimasu' is polite.",
          xp: 2,
        },
        {
          id: "e2",
          type: "image_select",
          prompt: "Which image matches 'ありがとう'?",
          images: ["👋", "🙏", "🌅", "🙇"],
          correctImageIndex: 1,
          promptTranslation: "thank you",
          xp: 2,
        },
        {
          id: "e3",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "goodbye",
          tokens: ["さようなら", "こんにちは", "ありがとう", "すみません"],
          correctOrder: "さようなら",
          xp: 2,
        },
        {
          id: "e4",
          type: "matching",
          prompt: "Match Japanese to English",
          pairs: [
            { left: "こんにちは", right: "hello" },
            { left: "さようなら", right: "goodbye" },
            { left: "ありがとう", right: "thank you" },
            { left: "おはよう", right: "good morning" },
          ],
          xp: 2,
        },
        {
          id: "e5",
          type: "listening",
          prompt: "Tap what you hear",
          audioText: "こんにちは",
          options: ["こんにちは", "さようなら", "ありがとう", "すみません"],
          correctIndex: 0,
          xp: 2,
        },
        {
          id: "e6",
          type: "speaking",
          prompt: "Say this",
          targetPhrase: "ありがとう",
          promptTranslation: "thank you",
          hint: "ah-ree-gah-toh",
          xp: 2,
        },
        {
          id: "e7",
          type: "fill_blank",
          prompt: "Complete: ___ gozaimasu (polite thank you)",
          sentence: "___ gozaimasu",
          blankAnswer: "ありがとう",
          xp: 2,
        },
      ],
    },
    {
      id: "ja-u1-l2",
      title: "Self-introduction",
      description: "Introduce yourself politely.",
      type: "lesson",
      xp: 10,
      vocab: [
        { word: "はじめまして", translation: "nice to meet you", pronunciation: "hah-jee-meh-mahs-teh", emoji: "🤝" },
        { word: "〜です", translation: "I am ~", pronunciation: "dehs", emoji: "➡️" },
        { word: "名前", translation: "name", pronunciation: "nah-meh", emoji: "🪪" },
        { word: "日本人", translation: "Japanese person", pronunciation: "nee-hon-jin", emoji: "🇯🇵" },
      ],
      exercises: [
        {
          id: "e1",
          type: "dialogue",
          prompt: "Lumo says: はじめまして!",
          promptTranslation: "Nice to meet you!",
          instruction: "Choose a natural reply",
          options: ["はじめまして", "さようなら", "ありがとう", "すみません"],
          correctIndex: 0,
          xp: 2,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "I am Japanese.",
          tokens: ["日本人", "です", "こんにちは", "名前"],
          correctOrder: "日本人です",
          xp: 2,
        },
        {
          id: "e3",
          type: "matching",
          prompt: "Match",
          pairs: [
            { left: "はじめまして", right: "nice to meet you" },
            { left: "名前", right: "name" },
            { left: "日本人", right: "Japanese person" },
            { left: "です", right: "am/is/are" },
          ],
          xp: 2,
        },
        {
          id: "e4",
          type: "fill_blank",
          prompt: "Complete: I ___ Maria.",
          sentence: "マリア___。",
          blankAnswer: "です",
          hint: "Polite copula",
          xp: 2,
        },
        {
          id: "e5",
          type: "speaking",
          prompt: "Say this",
          targetPhrase: "はじめまして",
          promptTranslation: "nice to meet you",
          hint: "hah-jee-meh-mahs-teh",
          xp: 2,
        },
      ],
    },
    {
      id: "ja-u1-l3",
      title: "Numbers & counting",
      description: "ichi, ni, san — 1, 2, 3.",
      type: "lesson",
      xp: 10,
      vocab: [
        { word: "一", translation: "one", pronunciation: "ee-chee", emoji: "1️⃣" },
        { word: "二", translation: "two", pronunciation: "nee", emoji: "2️⃣" },
        { word: "三", translation: "three", pronunciation: "sahn", emoji: "3️⃣" },
        { word: "四", translation: "four", pronunciation: "shee / yon", emoji: "4️⃣" },
        { word: "五", translation: "five", pronunciation: "go", emoji: "5️⃣" },
      ],
      exercises: [
        {
          id: "e1",
          type: "image_select",
          prompt: "Which means '三'?",
          images: ["1️⃣", "2️⃣", "3️⃣", "5️⃣"],
          correctImageIndex: 2,
          promptTranslation: "three",
          xp: 2,
        },
        {
          id: "e2",
          type: "matching",
          prompt: "Match the numbers",
          pairs: [
            { left: "一", right: "1" },
            { left: "二", right: "2" },
            { left: "三", right: "3" },
            { left: "五", right: "5" },
          ],
          xp: 2,
        },
        {
          id: "e3",
          type: "multiple_choice",
          prompt: "How do you say 'four'?",
          options: ["四", "三", "二", "一"],
          correctIndex: 0,
          explanation: "'四' is read 'yon' or 'shi' depending on context.",
          xp: 2,
        },
        {
          id: "e4",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "five",
          tokens: ["五", "四", "三", "一"],
          correctOrder: "五",
          xp: 2,
        },
        {
          id: "e5",
          type: "listening",
          prompt: "Tap what you hear",
          audioText: "二",
          options: ["二", "三", "一", "五"],
          correctIndex: 0,
          xp: 2,
        },
      ],
    },
    {
      id: "ja-u1-l4",
      title: "Story: Tokyo Coffee Shop",
      description: "Order coffee in Japanese.",
      type: "story",
      xp: 15,
      exercises: [
        {
          id: "e1",
          type: "dialogue",
          prompt: "Barista: いらっしゃいませ! (Welcome!)",
          promptTranslation: "Welcome to our shop!",
          instruction: "Choose the most polite reply",
          options: ["こんにちは", "すみません、コーヒーをください", "さようなら", "ありがとう"],
          correctIndex: 1,
          explanation: "'すみません、コーヒーをください' = 'Excuse me, coffee please.'",
          xp: 5,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "thank you very much",
          tokens: ["ありがとう", "ございます", "さようなら", "すみません"],
          correctOrder: "ありがとうございます",
          explanation: "Polite form: arigatou gozaimasu.",
          xp: 5,
        },
        {
          id: "e3",
          type: "multiple_choice",
          prompt: "You receive your coffee. What do you say?",
          options: ["ありがとう", "さようなら", "すみません", "こんにちは"],
          correctIndex: 0,
          xp: 5,
        },
      ],
    },
    {
      id: "ja-u1-l5",
      title: "Review",
      description: "Solidify Unit 1.",
      type: "review",
      xp: 12,
      exercises: [
        {
          id: "e1",
          type: "matching",
          prompt: "Match",
          pairs: [
            { left: "こんにちは", right: "hello" },
            { left: "ありがとう", right: "thank you" },
            { left: "はじめまして", right: "nice to meet you" },
            { left: "三", right: "3" },
          ],
          xp: 3,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "goodbye",
          tokens: ["さようなら", "こんにちは", "ありがとう", "すみません"],
          correctOrder: "さようなら",
          xp: 3,
        },
        {
          id: "e3",
          type: "fill_blank",
          prompt: "Polite 'thank you':",
          sentence: "ありがとう___",
          blankAnswer: "ございます",
          xp: 3,
        },
        {
          id: "e4",
          type: "listening",
          prompt: "Tap what you hear",
          audioText: "ありがとう",
          options: ["ありがとう", "さようなら", "すみません", "こんにちは"],
          correctIndex: 0,
          xp: 3,
        },
      ],
    },
  ],
};

const japaneseUnit2: UnitSpec = {
  id: "ja-u2",
  title: "Unit 2",
  subtitle: "食べもの — Food",
  description: "Talk about food, drinks and ordering.",
  color: "#ffc93c",
  lessons: [
    {
      id: "ja-u2-l1",
      title: "Common foods",
      description: "rice, water, tea, fish.",
      type: "lesson",
      xp: 10,
      vocab: [
        { word: "ご飯", translation: "rice / meal", pronunciation: "goh-han", emoji: "🍚" },
        { word: "水", translation: "water", pronunciation: "meez", emoji: "💧" },
        { word: "お茶", translation: "tea", pronunciation: "oh-chah", emoji: "🍵" },
        { word: "魚", translation: "fish", pronunciation: "sah-kah-nah", emoji: "🐟" },
        { word: "肉", translation: "meat", pronunciation: "nee-koo", emoji: "🥩" },
      ],
      exercises: [
        {
          id: "e1",
          type: "image_select",
          prompt: "Which means 'お茶'?",
          images: ["🍚", "💧", "🍵", "🐟"],
          correctImageIndex: 2,
          promptTranslation: "tea",
          xp: 2,
        },
        {
          id: "e2",
          type: "multiple_choice",
          prompt: "How do you say 'water'?",
          options: ["水", "お茶", "ご飯", "肉"],
          correctIndex: 0,
          xp: 2,
        },
        {
          id: "e3",
          type: "matching",
          prompt: "Match",
          pairs: [
            { left: "ご飯", right: "rice" },
            { left: "水", right: "water" },
            { left: "お茶", right: "tea" },
            { left: "魚", right: "fish" },
          ],
          xp: 2,
        },
        {
          id: "e4",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "fish, please",
          tokens: ["魚", "を", "ください", "ご飯"],
          correctOrder: "魚をください",
          xp: 2,
        },
        {
          id: "e5",
          type: "fill_blank",
          prompt: "Complete: tea, please",
          sentence: "お茶___ください。",
          blankAnswer: "を",
          hint: "Object marker",
          xp: 2,
        },
        {
          id: "e6",
          type: "listening",
          prompt: "Tap what you hear",
          audioText: "ご飯",
          options: ["ご飯", "水", "お茶", "肉"],
          correctIndex: 0,
          xp: 2,
        },
      ],
    },
    {
      id: "ja-u2-l2",
      title: "Ordering at a restaurant",
      description: "Phrase patterns for ordering.",
      type: "lesson",
      xp: 10,
      exercises: [
        {
          id: "e1",
          type: "dialogue",
          prompt: "Waiter: ご注文は? (Your order?)",
          promptTranslation: "What would you like?",
          instruction: "Choose the most natural order",
          options: ["お茶をください", "こんにちは", "さようなら", "ありがとう"],
          correctIndex: 0,
          xp: 2,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "I'll have water, please",
          tokens: ["水", "を", "ください", "お茶"],
          correctOrder: "水をください",
          xp: 2,
        },
        {
          id: "e3",
          type: "word_order",
          prompt: "Form the request",
          tokens: ["魚", "を", "ください"],
          correctOrder: "魚をください",
          tokensTranslation: "fish, please",
          xp: 2,
        },
        {
          id: "e4",
          type: "speaking",
          prompt: "Say this",
          targetPhrase: "お茶をください",
          promptTranslation: "tea, please",
          hint: "oh-chah oh koo-dah-sai",
          xp: 2,
        },
        {
          id: "e5",
          type: "fill_blank",
          prompt: "Complete: rice, please",
          sentence: "ご飯___ください。",
          blankAnswer: "を",
          xp: 2,
        },
      ],
    },
    {
      id: "ja-u2-l3",
      title: "Challenge: Restaurant Quiz",
      description: "Test your food vocab.",
      type: "challenge",
      xp: 20,
      exercises: [
        {
          id: "e1",
          type: "true_false",
          prompt: "'水' means 'tea'.",
          options: ["True", "False"],
          correctIndex: 1,
          explanation: "'水' is water; 'お茶' is tea.",
          xp: 5,
        },
        {
          id: "e2",
          type: "image_select",
          prompt: "Which is '魚'?",
          images: ["🍚", "💧", "🍵", "🐟"],
          correctImageIndex: 3,
          xp: 5,
        },
        {
          id: "e3",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "tea, please",
          tokens: ["お茶", "を", "ください", "ご飯"],
          correctOrder: "お茶をください",
          xp: 5,
        },
        {
          id: "e4",
          type: "fill_blank",
          prompt: "Complete: water",
          sentence: "___",
          blankAnswer: "水",
          xp: 5,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// FRENCH
// ─────────────────────────────────────────────────────────────────
const frenchUnit1: UnitSpec = {
  id: "fr-u1",
  title: "Unit 1",
  subtitle: "Bonjour !",
  description: "Greetings, polite phrases, and basic introductions.",
  color: "#a06bd6",
  lessons: [
    {
      id: "fr-u1-l1",
      title: "Greetings",
      description: "bonjour, salut, au revoir.",
      type: "lesson",
      xp: 10,
      vocab: [
        { word: "bonjour", translation: "hello / good day", pronunciation: "bohn-zhoor", emoji: "👋" },
        { word: "salut", translation: "hi / bye (casual)", pronunciation: "sah-loo", emoji: "✌️" },
        { word: "au revoir", translation: "goodbye", pronunciation: "oh ruh-vwahr", emoji: "👋" },
        { word: "merci", translation: "thank you", pronunciation: "mehr-see", emoji: "🙏" },
        { word: "s'il vous plaît", translation: "please", pronunciation: "seel voo pleh", emoji: "🥺" },
      ],
      exercises: [
        {
          id: "e1",
          type: "multiple_choice",
          prompt: "How do you say 'hello' in French?",
          options: ["bonjour", "merci", "au revoir", "salut"],
          correctIndex: 0,
          explanation: "'Bonjour' is the formal daytime greeting.",
          xp: 2,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "thank you",
          tokens: ["merci", "bonjour", "salut", "revoir"],
          correctOrder: "merci",
          xp: 2,
        },
        {
          id: "e3",
          type: "image_select",
          prompt: "Which image means 'merci'?",
          images: ["👋", "🙏", "✌️", "🥺"],
          correctImageIndex: 1,
          promptTranslation: "thank you",
          xp: 2,
        },
        {
          id: "e4",
          type: "matching",
          prompt: "Match",
          pairs: [
            { left: "bonjour", right: "hello" },
            { left: "au revoir", right: "goodbye" },
            { left: "merci", right: "thank you" },
            { left: "s'il vous plaît", right: "please" },
          ],
          xp: 2,
        },
        {
          id: "e5",
          type: "listening",
          prompt: "Tap what you hear",
          audioText: "bonjour",
          options: ["bonjour", "merci", "salut", "revoir"],
          correctIndex: 0,
          xp: 2,
        },
        {
          id: "e6",
          type: "speaking",
          prompt: "Say this",
          targetPhrase: "merci",
          promptTranslation: "thank you",
          hint: "mehr-see",
          xp: 2,
        },
        {
          id: "e7",
          type: "fill_blank",
          prompt: "Complete: hello, ___ (please)",
          sentence: "bonjour, ___",
          blankAnswer: "s'il vous plaît",
          xp: 2,
        },
      ],
    },
    {
      id: "fr-u1-l2",
      title: "Introductions",
      description: "Je m'appelle ... — My name is ...",
      type: "lesson",
      xp: 10,
      vocab: [
        { word: "je m'appelle", translation: "my name is", pronunciation: "zhuh mah-pehl", emoji: "🪪" },
        { word: "comment t'appelles-tu?", translation: "what's your name?", pronunciation: "koh-mahn tah-pehl too", emoji: "❓" },
        { word: "enchanté", translation: "nice to meet you", pronunciation: "ahn-shahn-tay", emoji: "🤝" },
        { word: "je suis", translation: "I am", pronunciation: "zhuh swee", emoji: "➡️" },
      ],
      exercises: [
        {
          id: "e1",
          type: "multiple_choice",
          prompt: "How do you say 'my name is'?",
          options: ["je m'appelle", "tu t'appelles", "enchanté", "je suis"],
          correctIndex: 0,
          xp: 2,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "nice to meet you",
          tokens: ["enchanté", "bonjour", "merci", "salut"],
          correctOrder: "enchanté",
          xp: 2,
        },
        {
          id: "e3",
          type: "dialogue",
          prompt: "Lumo asks: Comment t'appelles-tu?",
          promptTranslation: "What's your name?",
          instruction: "Choose the natural reply",
          options: ["Je m'appelle Léa", "Au revoir", "Merci", "S'il vous plaît"],
          correctIndex: 0,
          xp: 2,
        },
        {
          id: "e4",
          type: "fill_blank",
          prompt: "Complete: I am French.",
          sentence: "Je ___ français.",
          blankAnswer: "suis",
          hint: "Verb 'to be' (1st person)",
          xp: 2,
        },
        {
          id: "e5",
          type: "matching",
          prompt: "Match",
          pairs: [
            { left: "je m'appelle", right: "my name is" },
            { left: "comment t'appelles-tu?", right: "what's your name?" },
            { left: "enchanté", right: "nice to meet you" },
            { left: "je suis", right: "I am" },
          ],
          xp: 2,
        },
        {
          id: "e6",
          type: "speaking",
          prompt: "Say this",
          targetPhrase: "je m'appelle",
          promptTranslation: "my name is",
          hint: "zhuh mah-pehl",
          xp: 2,
        },
      ],
    },
    {
      id: "fr-u1-l3",
      title: "Story: Paris Café",
      description: "Order a coffee in Paris.",
      type: "story",
      xp: 15,
      exercises: [
        {
          id: "e1",
          type: "dialogue",
          prompt: "Server: Bonjour! Qu'est-ce que vous voulez?",
          promptTranslation: "Hello! What would you like?",
          instruction: "Reply politely",
          options: ["Un café, s'il vous plaît", "Salut", "Au revoir", "Merci"],
          correctIndex: 0,
          xp: 5,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "thank you very much",
          tokens: ["merci", "beaucoup", "bonjour", "au revoir"],
          correctOrder: "merci beaucoup",
          xp: 5,
        },
        {
          id: "e3",
          type: "multiple_choice",
          prompt: "How would you say 'goodbye' when leaving?",
          options: ["au revoir", "bonjour", "merci", "salut"],
          correctIndex: 0,
          xp: 5,
        },
      ],
    },
    {
      id: "fr-u1-l4",
      title: "Review",
      description: "Refresh Unit 1.",
      type: "review",
      xp: 12,
      exercises: [
        {
          id: "e1",
          type: "matching",
          prompt: "Match",
          pairs: [
            { left: "bonjour", right: "hello" },
            { left: "merci", right: "thank you" },
            { left: "je m'appelle", right: "my name is" },
            { left: "au revoir", right: "goodbye" },
          ],
          xp: 3,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "please",
          tokens: ["s'il", "vous", "plaît", "merci"],
          correctOrder: "s'il vous plaît",
          xp: 3,
        },
        {
          id: "e3",
          type: "fill_blank",
          prompt: "Complete: nice to meet you",
          sentence: "___!",
          blankAnswer: "enchanté",
          xp: 3,
        },
        {
          id: "e4",
          type: "listening",
          prompt: "Tap what you hear",
          audioText: "merci",
          options: ["merci", "bonjour", "salut", "revoir"],
          correctIndex: 0,
          xp: 3,
        },
      ],
    },
  ],
};

const frenchUnit2: UnitSpec = {
  id: "fr-u2",
  title: "Unit 2",
  subtitle: "La vie quotidienne — Daily life",
  description: "Days, time, and daily routines.",
  color: "#4d96ff",
  lessons: [
    {
      id: "fr-u2-l1",
      title: "Days of the week",
      description: "lundi, mardi, mercredi ...",
      type: "lesson",
      xp: 10,
      vocab: [
        { word: "lundi", translation: "Monday", emoji: "📅" },
        { word: "mardi", translation: "Tuesday", emoji: "📅" },
        { word: "mercredi", translation: "Wednesday", emoji: "📅" },
        { word: "jeudi", translation: "Thursday", emoji: "📅" },
        { word: "vendredi", translation: "Friday", emoji: "📅" },
      ],
      exercises: [
        {
          id: "e1",
          type: "multiple_choice",
          prompt: "How do you say 'Monday'?",
          options: ["lundi", "mardi", "mercredi", "vendredi"],
          correctIndex: 0,
          xp: 2,
        },
        {
          id: "e2",
          type: "matching",
          prompt: "Match",
          pairs: [
            { left: "lundi", right: "Monday" },
            { left: "mardi", right: "Tuesday" },
            { left: "mercredi", right: "Wednesday" },
            { left: "vendredi", right: "Friday" },
          ],
          xp: 2,
        },
        {
          id: "e3",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "Friday",
          tokens: ["vendredi", "lundi", "mardi", "jeudi"],
          correctOrder: "vendredi",
          xp: 2,
        },
        {
          id: "e4",
          type: "fill_blank",
          prompt: "Complete: Today is ___ (Tuesday).",
          sentence: "Aujourd'hui, c'est ___.",
          blankAnswer: "mardi",
          xp: 2,
        },
        {
          id: "e5",
          type: "listening",
          prompt: "Tap what you hear",
          audioText: "mercredi",
          options: ["mercredi", "lundi", "mardi", "vendredi"],
          correctIndex: 0,
          xp: 2,
        },
      ],
    },
    {
      id: "fr-u2-l2",
      title: "Challenge: Week Quiz",
      description: "Test your week vocabulary.",
      type: "challenge",
      xp: 20,
      exercises: [
        {
          id: "e1",
          type: "true_false",
          prompt: "'mercredi' is Wednesday.",
          options: ["True", "False"],
          correctIndex: 0,
          xp: 5,
        },
        {
          id: "e2",
          type: "translation",
          prompt: "Translate",
          promptTranslation: "Monday",
          tokens: ["lundi", "mardi", "mercredi", "vendredi"],
          correctOrder: "lundi",
          xp: 5,
        },
        {
          id: "e3",
          type: "matching",
          prompt: "Match",
          pairs: [
            { left: "mardi", right: "Tuesday" },
            { left: "jeudi", right: "Thursday" },
            { left: "vendredi", right: "Friday" },
            { left: "lundi", right: "Monday" },
          ],
          xp: 5,
        },
        {
          id: "e4",
          type: "fill_blank",
          prompt: "Complete: Friday",
          sentence: "___",
          blankAnswer: "vendredi",
          xp: 5,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// Export catalog
// ─────────────────────────────────────────────────────────────────
export const COURSES: CourseSpec[] = [
  {
    id: "course-es",
    languageId: "es",
    title: "Spanish for English speakers",
    description: "Learn Spanish from scratch — greetings, travel, food, and culture.",
    iconColor: "#58cc8d",
    units: [spanishUnit1, spanishUnit2],
  },
  {
    id: "course-ja",
    languageId: "ja",
    title: "Japanese for English speakers",
    description: "Greetings, food, and essential phrases for travel in Japan.",
    iconColor: "#ff6b6b",
    units: [japaneseUnit1, japaneseUnit2],
  },
  {
    id: "course-fr",
    languageId: "fr",
    title: "French for English speakers",
    description: "Bonjour! Master everyday French with bite-sized lessons.",
    iconColor: "#a06bd6",
    units: [frenchUnit1, frenchUnit2],
  },
];

export function findCourse(courseId: string): CourseSpec | undefined {
  return COURSES.find((c) => c.id === courseId);
}

export function findLesson(lessonId: string): { lesson: LessonSpec; course: CourseSpec; unit: UnitSpec } | undefined {
  for (const course of COURSES) {
    for (const unit of course.units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) return { lesson, course, unit };
    }
  }
  return undefined;
}

/** Flatten vocab across a unit for SRS / review */
export function collectUnitVocab(unit: UnitSpec): VocabItem[] {
  return unit.lessons.flatMap((l) => l.vocab ?? []);
}
