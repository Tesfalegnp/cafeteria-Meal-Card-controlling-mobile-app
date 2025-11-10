import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: 'How do I reset my password?',
      answer: 'You can reset your password by going to Settings > Change Password. You will need to enter your current password and then set a new one.',
    },
    {
      question: 'How can I update my profile information?',
      answer: 'Navigate to Settings > Profile to update your personal information, contact details, and other profile settings.',
    },
    {
      question: 'What should I do if the app crashes?',
      answer: 'Try restarting the app first. If the problem persists, go to Settings > Help & Support to report the issue or contact our technical support team.',
    },
    {
      question: 'How do I change the app language?',
      answer: 'Go to Settings > Language to select your preferred language from the available options.',
    },
    {
      question: 'Can I customize the app appearance?',
      answer: 'Yes, you can customize the theme and appearance in Settings > Theme & Appearance.',
    },
    {
      question: 'How do I submit feedback or complaints?',
      answer: 'Use the Complaint & Feedback section in Settings to submit any issues, suggestions, or feedback you may have.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      
      <View style={styles.faqContainer}>
        {faqData.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqQuestion}
              onPress={() => toggleFAQ(index)}
            >
              <Text style={styles.questionText}>{faq.question}</Text>
              <Icon
                name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
            {expandedIndex === index && (
              <View style={styles.faqAnswer}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.helpSection}>
        <Text style={styles.helpTitle}>Still need help?</Text>
        <Text style={styles.helpDescription}>
          If you couldn't find the answer to your question, our support team is here to help.
        </Text>
        <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/settings/help')}>
          <Text style={styles.helpButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f8fb' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 30, textAlign: 'center' },
  faqContainer: { marginBottom: 30 },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  helpSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  helpDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  helpButton: {
    backgroundColor: '#2f95dc',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});