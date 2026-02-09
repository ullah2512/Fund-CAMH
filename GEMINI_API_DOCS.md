# Gemini API Integration Documentation

## Overview
The Gemini API integration provides AI-generated empathetic reflections for user posts in the CAMH community platform. This document describes the behavior, error handling, and monitoring capabilities.

## Features

### 1. AI-Generated Reflections
When functioning properly, the Gemini API generates unique, context-aware reflections for each post based on:
- Post content
- Category (Anxiety, Depression, General Support, Resources)
- Configured parameters (temperature: 0.6, topP: 0.9)

### 2. Intelligent Error Handling
The system distinguishes between five types of errors:

#### Error Types
1. **INVALID_API_KEY**: Authentication failures (401, unauthorized)
   - Logged as: `⚠️ GEMINI API KEY ISSUE`
   - Action: Verify `VITE_GEMINI_API_KEY` environment variable

2. **QUOTA_EXCEEDED**: Rate limit or quota issues (429)
   - Logged as: `⚠️ GEMINI QUOTA EXCEEDED`
   - Action: Consider upgrading API plan

3. **NETWORK_ERROR**: Connectivity problems
   - Logged as: `⚠️ NETWORK ERROR`
   - Action: Temporary issue, will retry on next request

4. **INVALID_RESPONSE**: Empty or malformed API responses
   - Logged as: Warning with details
   - Action: Review API response format

5. **UNKNOWN_ERROR**: Other failures
   - Logged with full error details
   - Action: Review error logs for specifics

### 3. Context-Aware Fallbacks
When the API is unavailable or fails, the system provides varied fallback responses instead of a single generic message.

#### Theme-Based Fallbacks
The system detects themes in post content and provides matching responses:

| Theme | Keywords | Example Response |
|-------|----------|------------------|
| Strength | strong, brave, courage, resilient, overcome | "Your strength in sharing this is evident. Keep going." |
| Hope | hope, better, improve, forward, future, tomorrow | "Thank you for your hopeful message. It can inspire others." |
| Support | help, support, together, community, friend, talk | "Thank you for fostering connection and support here." |
| Healing | heal, recover, progress, journey, step, process | "Your journey matters. Thank you for sharing this part of it." |
| Gratitude | thank, grateful, appreciate, blessed | "Your gratitude shines through. Thank you for sharing positivity." |

#### Category-Based Fallbacks
When no theme is detected, responses vary by category:

**Anxiety:**
- "Thank you for sharing. Your courage in expressing this matters."
- "You're taking an important step by reaching out. Keep moving forward."
- "Thank you for trusting us with your thoughts. You're not alone in this."

**Depression:**
- "Thank you for opening up. Every small step forward counts."
- "Your voice matters here. Thank you for sharing your experience."
- "Reaching out is a sign of strength. Thank you for being here."

**Resources:**
- "Thank you for sharing this resource. It may help someone in need."
- "We appreciate you contributing helpful information to the community."
- "Thank you for taking the time to share this with others."

**General Support:**
- "Thank you for contributing to our community. Your words matter."
- "We appreciate you sharing this with us. You're making a difference."
- "Thank you for being part of this supportive space."

The system uses pseudo-random selection (based on content length) to vary responses even within the same category.

### 4. Comprehensive Logging

#### Success Logs
```
✓ Gemini AI reflection generated successfully for [Category] post
```

#### Failure Logs
```
[2026-02-09T05:21:28.561Z] Gemini API Fallback Triggered: {
  errorType: 'INVALID_API_KEY',
  category: 'Anxiety',
  contentPreview: 'I feel anxious about everything lately...',
  errorDetails: 'API key not valid. Please pass a valid API key.'
}
⚠️ GEMINI API KEY ISSUE: Please verify VITE_GEMINI_API_KEY environment variable is set correctly.
```

## Configuration

### Environment Variables
- `VITE_GEMINI_API_KEY`: Primary API key location (Vite convention)
- `_VITE_GEMINI_API_KEY`: Fallback API key location

### API Configuration
- **Model**: `gemini-3-flash-preview`
- **Temperature**: 0.6 (balanced creativity and consistency)
- **Top P**: 0.9 (diverse but coherent outputs)
- **Max Length**: 20 words per reflection
- **System Instruction**: Mental health advocate persona with professional yet warm tone

## Monitoring

### Key Metrics to Monitor
1. **Success Rate**: Check for ratio of success logs vs. fallback logs
2. **Error Distribution**: Track which error types are most common
3. **Fallback Triggers**: Monitor frequency and patterns of fallback usage

### Console Monitoring
Search for these patterns in application logs:
- `✓ Gemini AI reflection generated successfully` - Successful API calls
- `Gemini API Fallback Triggered` - API failures
- `⚠️ GEMINI API KEY` - Authentication issues
- `⚠️ GEMINI QUOTA EXCEEDED` - Quota issues
- `⚠️ NETWORK ERROR` - Connectivity issues

## Testing Scenarios

### 1. Valid API Key
**Expected Behavior:**
- Unique, AI-generated reflections for each post
- Success logs in console
- No fallback messages

### 2. Invalid/Missing API Key
**Expected Behavior:**
- Context-aware fallback responses
- Different fallbacks for different posts
- Error logs: `⚠️ GEMINI API KEY ISSUE`

### 3. Quota Exceeded
**Expected Behavior:**
- Context-aware fallback responses
- Error logs: `⚠️ GEMINI QUOTA EXCEEDED`
- Recommendation to upgrade plan

### 4. Network Issues
**Expected Behavior:**
- Context-aware fallback responses
- Error logs: `⚠️ NETWORK ERROR`
- System will retry on next request

### 5. Empty Post Content
**Expected Behavior:**
- Warning log: `Empty content provided to enhancePost`
- Generic fallback response

## Troubleshooting

### Issue: All posts receiving identical fallback responses
**Cause**: Old implementation (prior to this fix)
**Solution**: Ensure latest code is deployed with context-aware fallback logic

### Issue: API key errors in production
**Cause**: Missing or incorrect environment variable
**Solution**: 
1. Verify `VITE_GEMINI_API_KEY` is set in environment
2. Check API key is valid at https://ai.google.dev/
3. Ensure key has appropriate permissions

### Issue: Quota exceeded frequently
**Cause**: High usage or low quota
**Solution**:
1. Monitor API usage in Google Cloud Console
2. Consider upgrading API plan
3. Implement request caching if appropriate

### Issue: Fallbacks triggering for valid API key
**Cause**: API response format may have changed
**Solution**:
1. Check console logs for specific error type
2. Verify `response.text` property exists in API response
3. Update error handling if API contract changed

## Best Practices

1. **Always Monitor Logs**: Regular review of console logs helps identify issues early
2. **Test Both Scenarios**: Validate behavior with both valid and invalid API keys
3. **Update API Keys Securely**: Never commit API keys to source control
4. **Handle Fallbacks Gracefully**: Current implementation ensures users always receive supportive messages
5. **Track Success Rates**: Monitor ratio of AI-generated vs. fallback responses

## Future Enhancements

Potential improvements for consideration:
- Retry logic with exponential backoff for transient failures
- Response caching to reduce API calls
- A/B testing of different fallback strategies
- User feedback collection on reflection quality
- Additional theme detection categories
- Multi-language support for international users
