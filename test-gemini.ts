/**
 * Manual test script for Gemini API integration
 * This script tests the enhancePost function with various scenarios
 */

import { enhancePost } from './services/gemini';

async function runTests() {
  console.log('====================================');
  console.log('Gemini API Integration Tests');
  console.log('====================================\n');

  // Test 1: Different posts with same category should get different responses
  console.log('Test 1: Testing variability in fallback responses');
  console.log('---------------------------------------------------');
  
  const posts = [
    { content: 'I feel anxious about everything lately', category: 'Anxiety' },
    { content: 'My anxiety has been overwhelming this week', category: 'Anxiety' },
    { content: 'I struggle with anxiety daily and need support', category: 'Anxiety' },
  ];

  for (const post of posts) {
    console.log(`\nPost: "${post.content}"`);
    const reflection = await enhancePost(post.content, post.category);
    console.log(`AI Reflection: "${reflection}"`);
  }

  // Test 2: Different categories should trigger different fallbacks
  console.log('\n\nTest 2: Testing category-specific fallbacks');
  console.log('---------------------------------------------------');
  
  const categoryTests = [
    { content: 'I feel depressed and need help', category: 'Depression' },
    { content: 'Looking for resources to cope with stress', category: 'Resources' },
    { content: 'I want to share something helpful', category: 'General Support' },
  ];

  for (const test of categoryTests) {
    console.log(`\nCategory: ${test.category}`);
    console.log(`Post: "${test.content}"`);
    const reflection = await enhancePost(test.content, test.category);
    console.log(`AI Reflection: "${reflection}"`);
  }

  // Test 3: Theme-based fallbacks
  console.log('\n\nTest 3: Testing theme-based fallbacks');
  console.log('---------------------------------------------------');
  
  const themeTests = [
    { content: 'I am feeling strong and brave today', category: 'General Support', expectedTheme: 'strength' },
    { content: 'I have hope for a better tomorrow', category: 'General Support', expectedTheme: 'hope' },
    { content: 'Thank you for the support from this community', category: 'General Support', expectedTheme: 'support/gratitude' },
    { content: 'My healing journey continues step by step', category: 'General Support', expectedTheme: 'healing' },
  ];

  for (const test of themeTests) {
    console.log(`\nExpected Theme: ${test.expectedTheme}`);
    console.log(`Post: "${test.content}"`);
    const reflection = await enhancePost(test.content, test.category);
    console.log(`AI Reflection: "${reflection}"`);
  }

  // Test 4: Empty content handling
  console.log('\n\nTest 4: Testing empty content handling');
  console.log('---------------------------------------------------');
  try {
    const reflection = await enhancePost('', 'General Support');
    console.log(`Empty post reflection: "${reflection}"`);
  } catch (error) {
    console.error('Error with empty content:', error);
  }

  console.log('\n====================================');
  console.log('Tests completed!');
  console.log('====================================\n');
  console.log('Note: If you see fallback responses, check the console for detailed error information.');
  console.log('Look for warnings like "GEMINI API KEY MISSING" or "GEMINI QUOTA EXCEEDED".');
}

// Run the tests
runTests().catch(console.error);
