// =============================================================================
// chatbot.test.js
//
// This file contains unit tests for the chatWithPet controller function.
// It uses Jest to mock the GoogleGenerativeAI library and simulate Express
// request/response objects to test different scenarios.
// =============================================================================

// Mock the entire @google/generative-ai module
// This prevents actual API calls to Gemini during tests and allows us to control
// the responses the mock Gemini model returns.
jest.mock('@google/generative-ai', () => {
  // These mock functions will capture calls and allow us to define their behavior.
  const mockSendMessage = jest.fn();
  const mockStartChat = jest.fn(() => ({
      sendMessage: mockSendMessage, // The chat session returns a sendMessage method
  }));
  const mockGetGenerativeModel = jest.fn(() => ({
      startChat: mockStartChat, // The model returns a startChat method
  }));

  // Return the mocked GoogleGenerativeAI class
  return {
      GoogleGenerativeAI: jest.fn(() => ({
          getGenerativeModel: mockGetGenerativeModel, // The main class returns getGenerativeModel
      })),
      // Export the mock functions so we can access them in our tests
      _mockSendMessage: mockSendMessage,
      _mockStartChat: mockStartChat,
      _mockGetGenerativeModel: mockGetGenerativeModel,
  };
});

// Import the controller function we want to test
const { chatWithPet } = require('../controllers/chatbotController');

// Import the mocked functions from the @google/generative-ai module
const {
  _mockSendMessage,
  _mockStartChat,
  _mockGetGenerativeModel,
} = require('@google/generative-ai');

// Mock dotenv to prevent it from trying to load a .env file during tests.
// This ensures tests are isolated and don't depend on external files.
jest.mock('dotenv', () => ({
  config: jest.fn(), // Mock the config method
}));

// Set a dummy API key for the test environment.
// This is important because the controller checks for process.env.GEMINI_API_KEY.
process.env.GEMINI_API_KEY = 'TEST_API_KEY';

describe('chatWithPet Controller', () => {
  // Before each test, reset all mocks to their initial state.
  // This ensures that tests are independent and don't affect each other.
  beforeEach(() => {
      jest.clearAllMocks();
      // Reset the default behavior for sendMessage to return a simple text response
      _mockSendMessage.mockResolvedValue({
          response: {
              text: () => 'Mocked AI response',
          },
      });
  });

  // Test case 1: Should return 400 if newUserInput is missing
  test('should return 400 if newUserInput is missing', async () => {
      const req = {
          body: {
              chatHistory: [],
              // newUserInput is intentionally missing
          },
      };
      const res = {
          status: jest.fn().mockReturnThis(), // Mock status method to allow chaining
          json: jest.fn(), // Mock json method to capture the response body
      };

      await chatWithPet(req, res);

      // Assert that status 400 was set and the correct error message was returned
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "newUserInput is required in the request body." });
      // Ensure that no Gemini API calls were made
      expect(_mockGetGenerativeModel).not.toHaveBeenCalled();
  });

  // Test case 2: Should successfully get a response from Gemini for a new chat
  test('should successfully get a response from Gemini for a new chat', async () => {
      const req = {
          body: {
              chatHistory: [], // Empty history for a new chat
              newUserInput: 'Hi Hunter!',
          },
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Define the specific response the mock Gemini model should return for this test
      _mockSendMessage.mockResolvedValueOnce({
          response: {
              text: () => "Hello there! I'm Hunter, ready to help you prepare!",
          },
      });

      await chatWithPet(req, res);

      // Assert that the Gemini model and chat session were initialized correctly
      expect(_mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });
      expect(_mockStartChat).toHaveBeenCalledWith({
          history: [
              { role: 'user', parts: [{ text: expect.any(String) }] }, // System instruction
          ],
          generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7,
          },
          safetySettings: expect.any(Array), // Check that safety settings were passed
      });
      // Assert that the new user input was sent to the chat session
      expect(_mockSendMessage).toHaveBeenCalledWith('Hi Hunter!');
      // Assert that status 200 was returned with the AI's response
      expect(res.status).not.toHaveBeenCalledWith(500); // Ensure no 500 error
      expect(res.json).toHaveBeenCalledWith({ message: "Hello there! I'm Hunter, ready to help you prepare!" });
  });

  // Test case 3: Should successfully get a response from Gemini for a multi-turn chat
  test('should successfully get a response from Gemini for a multi-turn chat', async () => {
      const chatHistory = [
          { role: 'user', parts: [{ text: 'User intro message' }] },
          { role: 'model', parts: [{ text: 'Hunter intro response' }] },
          { role: 'user', parts: [{ text: 'User response to intro' }] },
          { role: 'model', parts: [{ text: 'Hunter first question' }] },
      ];

      const req = {
          body: {
              chatHistory: chatHistory, // Existing chat history
              newUserInput: 'Yes, I had a cat before.', // New user input
          },
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      _mockSendMessage.mockResolvedValueOnce({
          response: {
              text: () => "That's great! What was your experience like with your cat?",
          },
      });

      await chatWithPet(req, res);

      // Construct the expected history that would be sent to Gemini
      const expectedHistory = [
          { role: 'user', parts: [{ text: expect.any(String) }] }, // System instruction
          ...chatHistory, // Previous turns
      ];

      expect(_mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });
      expect(_mockStartChat).toHaveBeenCalledWith({
          history: expectedHistory, // Verify the full history including system instruction
          generationConfig: expect.any(Object),
          safetySettings: expect.any(Array),
      });
      expect(_mockSendMessage).toHaveBeenCalledWith('Yes, I had a cat before.');
      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "That's great! What was your experience like with your cat?" });
  });

  // Test case 4: Should handle errors from the Gemini API gracefully
  test('should handle errors from the Gemini API gracefully', async () => {
      const req = {
          body: {
              chatHistory: [],
              newUserInput: 'Tell me about adoption.',
          },
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      // Make the mock sendMessage reject with an error
      const mockError = new Error('Gemini API call failed');
      mockError.response = { status: 429, data: { error: 'Rate limit exceeded' } }; // Simulate a real API error structure
      _mockSendMessage.mockRejectedValueOnce(mockError);

      await chatWithPet(req, res);

      // Assert that the error status and message were returned
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to get response from chatbot" });
      // Verify that console.error was called for debugging purposes
      expect(console.error).toHaveBeenCalledTimes(3); // Once for general error, once for status, once for data
  });
});

// Mock console.error to prevent test output from being cluttered
// and to assert that errors are logged.
// Place this at the top level of your test file.
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks(); // Restore original console.error after all tests
});