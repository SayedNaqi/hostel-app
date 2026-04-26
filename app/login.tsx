// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Colors, FontSize, Radius, Shadow, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const fillCredentials = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setEmail('student@hostel.com');
      setPassword('123456');
    } else {
      setEmail('admin@hostel.com');
      setPassword('123456');
    }
    setError('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <Image
            source={require('@/assets/images/onboarding-hero.png')}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.logoWrap}>
              <MaterialIcons name="domain" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.appName}>HostelHub</Text>
            <Text style={styles.tagline}>Smart Hostel Management</Text>
          </View>
        </View>

        {/* Mock Login Banner */}
        <View style={styles.mockBanner}>
          <MaterialIcons name="info" size={14} color={Colors.warning} />
          <Text style={styles.mockText}>DEMO MODE — Use quick login buttons below</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.welcomeText}>Sign In</Text>
          <Text style={styles.subtitleText}>Access your hostel dashboard</Text>

          {/* Quick login */}
          <View style={styles.quickRow}>
            <Pressable onPress={() => fillCredentials('student')} style={styles.quickBtn}>
              <MaterialIcons name="school" size={16} color={Colors.primary} />
              <Text style={styles.quickText}>Student Login</Text>
            </Pressable>
            <Pressable onPress={() => fillCredentials('admin')} style={[styles.quickBtn, { borderColor: Colors.adminColor }]}>
              <MaterialIcons name="admin-panel-settings" size={16} color={Colors.adminColor} />
              <Text style={[styles.quickText, { color: Colors.adminColor }]}>Admin Login</Text>
            </Pressable>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or enter manually</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="email" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@hostel.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="lock" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPass}
              />
              <Pressable onPress={() => setShowPass(p => !p)} style={styles.eyeBtn} hitSlop={8}>
                <MaterialIcons name={showPass ? 'visibility-off' : 'visibility'} size={18} color={Colors.textMuted} />
              </Pressable>
            </View>
          </View>

          {error ? (
            <View style={styles.errorWrap}>
              <MaterialIcons name="error-outline" size={14} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button label="Sign In" onPress={handleLogin} loading={loading} fullWidth size="lg" style={{ marginTop: Spacing.md }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  heroSection: { height: 220, marginHorizontal: Spacing.md, borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.md, ...Shadow.md },
  heroImage: { ...StyleSheet.absoluteFillObject },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,17,23,0.55)' },
  heroContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.primary },
  appName: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 0.5 },
  tagline: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  mockBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.warningMuted, marginHorizontal: Spacing.md, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 8, marginBottom: Spacing.md },
  mockText: { fontSize: FontSize.xs, color: Colors.warning, fontWeight: '600', flex: 1 },
  form: { backgroundColor: Colors.surface, marginHorizontal: Spacing.md, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.surfaceBorder, ...Shadow.sm },
  welcomeText: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  subtitleText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  quickRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  quickText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.primary },
  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.surfaceBorder },
  dividerText: { fontSize: FontSize.xs, color: Colors.textMuted },
  fieldWrap: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.textSecondary, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.surfaceBorder, paddingHorizontal: Spacing.sm },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: FontSize.md, color: Colors.textPrimary },
  eyeBtn: { padding: Spacing.sm },
  errorWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.dangerMuted, padding: Spacing.sm, borderRadius: Radius.md, marginBottom: Spacing.sm },
  errorText: { fontSize: FontSize.sm, color: Colors.danger, flex: 1 },
});
