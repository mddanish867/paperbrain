import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const sendMessageStreamApi = async ({
  message,
  session_id,
  document_id
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id,
        document_id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.body;
  } catch (error) {
    toast.error('Failed to send message');
    throw error;
  }
};

export const regenerateAnswerApi = async ({
  message_id,
  session_id,
  document_id
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message_id,
        session_id,
        document_id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to regenerate answer');
    }

    return response.body;
  } catch (error) {
    toast.error('Failed to regenerate answer');
    throw error;
  }
};

export const sendFeedbackApi = async ({
  message_id,
  feedback_type, // 'like' or 'dislike'
  session_id
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message_id,
        feedback_type,
        session_id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send feedback');
    }

    return await response.json();
  } catch (error) {
    console.error('Feedback error:', error);
    throw error;
  }
};

export const shareMessageApi = async ({ message_id, message_text }) => {
  try {
    // For now, just copy to clipboard
    await navigator.clipboard.writeText(message_text);
    toast.success('Message copied to clipboard!');
    
    // In the future, you could implement social sharing
    return { success: true };
  } catch (error) {
    toast.error('Failed to share message');
    throw error;
  }
};