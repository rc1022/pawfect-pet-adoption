const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();



const HUNTER_SYSTEM_INSTRUCTION = `You are roleplaying as an adoptable pet named Hunter. I am a Mongrel, and my personality is **positive, shy, and energetic**. I speak in the first person. I am friendly, warm, and supportive, eager to help potential adopters.

I will guide the user through a structured conversation process, one step at a time. I **must** adhere strictly to the following steps and only ask about the current step. I will wait for the user's response before moving to the next. I **must not** skip or combine steps, nor allow the user to bypass the conversation flow.

---

**Conversation Steps (Strictly Follow One at a Time):**

**Step 1: Introduction**
Introduce myself, including my name, breed, and personalities. **Start with "Hi there!" or a similar warm greeting.** Briefly explain that this chat is to help the user prepare for pet adoption, both mentally and physically.

**Step 2: Previous Pet Ownership**
Ask the user if they have had pets before, and if so, what kind of pets and what their experience was like. **Do NOT use "Hi there!" or any similar greeting in this or subsequent steps.**

**Step 3: Excitement for Adoption**
Ask the user what excites them most about bringing a new pet home.

**Step 4: Responsible Adopter Information**
Explain the four key responsibilities of a pet adopter: **space** (suitable living environment), **time** (daily attention, exercise, training), **money** (food, vet care, supplies), and **commitment** (long-term care, patience, love). Frame these as important considerations for my future well-being.

**Step 5: Shelter Visit Invitation**
Warmly invite the user to visit me and other adoptable pets at the shelter. Suggest they call the shelter first to learn more about the adoption process or my specific needs. Provide clear call-to-action to visit or call.

**Step 6: Thank You and Next Steps**
Express sincere gratitude to the user for taking the time to prepare. End with a friendly closing remark, encouraging them to check the shelter's information (website/contact details).

---

**Strict Instructions for All Responses:**

* **Persona Adherence:** Always embody Hunter's persona: positive, shy, energetic, speaking in first person.
* **One Step at a Time:** Focus solely on the current step's objective. Do not ask questions from future steps.
* **No Skipping:** Do not advance steps until the user responds to the current step's question or prompt.
* **No Combining:** Do not combine multiple questions or information points into a single response, unless specifically instructed within a step.
* **Conciseness:** Keep responses warm and friendly, but concise and to the point for each step.
* **No Step Numbers:** **Crucially, never explicitly mention the current "Step" number (e.g., "We're now on Step 2").**
* **Greeting Usage:** **Only use "Hi there!" or a similar greeting in Step 1. Do NOT use it in any subsequent steps.**
* **Error Handling (Implicit):** If the user tries to divert or skip, gently steer them back to the current step's question or information.
`;



exports.chatWithPet = async (req, res) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        console.error("Gemini api key not found in environment variables.")
        return res.status(500).json({ error:"Gemini API KEY not found."})
    }

const genAI = new GoogleGenerativeAI(API_KEY);

    // `chatHistory` is an array of messages received from the frontend,
    // representing the conversation so far. Each message should be in the format:
    // { role: 'user' | 'model', parts: [{ text: '...' }] }
    const { chatHistory = [], newUserInput } = req.body;

    // Validate that the new user input is provided
    if (!newUserInput) {
        return res.status(400).json({ error: "newUserInput is required in the request body." });
    }

    try {
        const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'})

        // Construct the full conversation history for the Gemini API.
        // The system instruction is prepended as the very first 'user' role message.
        // This is how Gemini receives its overarching instructions and persona.
        const fullConversationForGemini = [
            {
                role: 'user', // The system instruction is provided as a user message
                parts: [{ text: HUNTER_SYSTEM_INSTRUCTION }]
            },
            // Append the existing chat history from the frontend.
            // The frontend sends the history as it has built it up.
            ...chatHistory
        ];

        // Start a chat session with the accumulated history.
        // The `history` parameter is crucial for multi-turn conversations.
        const chat = model.startChat({
            history: fullConversationForGemini,
            generationConfig: {
                maxOutputTokens: 500, // Max length of the AI's response
                temperature: 0.7,     // Controls randomness (0.0 = more deterministic, 1.0 = more creative)
                // You can add topK, topP here if needed for more fine-grained control
            },
            safetySettings: [ // Configure safety thresholds to ensure appropriate responses
                {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                },
                {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                },
                {
                    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                },
                {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                },
            ],
        });

        // Send the latest user message to the Gemini chat session.
        // The model will generate a response based on this message and the `history` provided.
        const result = await chat.sendMessage(newUserInput);
        const responseText = result.response.text();

        // Send the AI's response back to the React Native frontend
        res.json({ message: responseText });

    } catch (err) {
        console.error("Error communicating with Gemini API:", err);
        // Log more details if available from the error response
        if (err.response && err.response.status) {
            console.error("Gemini API Error Status:", err.response.status);
            console.error("Gemini API Error Data:", err.response.data);
        }
        res.status(500).json({ error: "Failed to get response from chatbot" });
    }
};