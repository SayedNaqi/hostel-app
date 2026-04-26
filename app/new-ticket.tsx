// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTickets } from '@/hooks/useTickets';
import { useAlert } from '@/template';
import { Button } from '@/components/ui/Button';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { Ticket } from '@/services/mockData';

type Category = Ticket['category'];
type Priority = Ticket['priority'];

const CATEGORIES: { value: Category; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { value: 'maintenance', label: 'Maintenance', icon: 'build' },
  { value: 'complaint', label: 'Complaint', icon: 'report' },
  { value: 'request', label: 'Request', icon: 'assignment' },
  { value: 'other', label: 'Other', icon: 'help-outline' },
];

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: Colors.success },
  { value: 'medium', label: 'Medium', color: Colors.warning },
  { value: 'high', label: 'High', color: Colors.danger },
];

export default function NewTicketScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { createTicket, isLoading } = useTickets();
  const { showAlert } = useAlert();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('maintenance');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = async () => {
    if (!title.trim()) { showAlert('Missing Title', 'Please enter a title for your ticket.'); return; }
    if (!description.trim()) { showAlert('Missing Description', 'Please describe your issue.'); return; }

    const result = await createTicket({ title: title.trim(), description: description.trim(), category, priority });
    if (result) {
      showAlert('Ticket Created', 'Your ticket has been submitted. We will get back to you soon.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.sm, paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn} hitSlop={8}>
            <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
          </Pressable>
          <Text style={styles.pageTitle}>New Ticket</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Brief summary of your issue"
            placeholderTextColor={Colors.textMuted}
            maxLength={100}
          />
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.optionRow}>
            {CATEGORIES.map(c => (
              <Pressable
                key={c.value}
                onPress={() => setCategory(c.value)}
                style={[styles.optionBtn, category === c.value && styles.optionBtnActive]}
              >
                <MaterialIcons name={c.icon} size={18} color={category === c.value ? Colors.primary : Colors.textMuted} />
                <Text style={[styles.optionText, category === c.value && styles.optionTextActive]}>{c.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Priority */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map(p => (
              <Pressable
                key={p.value}
                onPress={() => setPriority(p.value)}
                style={[styles.priorityBtn, priority === p.value && { backgroundColor: p.color + '22', borderColor: p.color }]}
              >
                <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                <Text style={[styles.priorityText, priority === p.value && { color: p.color, fontWeight: '600' }]}>{p.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your issue in detail..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <Button label="Submit Ticket" onPress={handleSubmit} loading={isLoading} fullWidth size="lg" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg, paddingVertical: Spacing.sm },
  closeBtn: { width: 38, height: 38, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  pageTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  field: { marginBottom: Spacing.lg },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.surfaceBorder, padding: Spacing.md, fontSize: FontSize.md, color: Colors.textPrimary },
  textArea: { minHeight: 120, paddingTop: Spacing.md },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: { flex: 1, minWidth: '45%', flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.surfaceBorder, backgroundColor: Colors.surface },
  optionBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  optionText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '500' },
  optionTextActive: { color: Colors.primary },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.surfaceBorder, backgroundColor: Colors.surface },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityText: { fontSize: FontSize.sm, color: Colors.textSecondary },
});
