// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { useRooms } from '@/hooks/useRooms';
import { useTickets } from '@/hooks/useTickets';
import { Badge } from '@/components/ui/Badge';
import { Colors, FontSize, Radius, Shadow, Spacing } from '@/constants/theme';

interface MenuItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value?: string;
  color?: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

function MenuItem({ icon, label, value, color, onPress, isDestructive }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.75 }]}
    >
      <View style={[styles.menuIcon, { backgroundColor: (color || Colors.primary) + '22' }]}>
        <MaterialIcons name={icon} size={20} color={isDestructive ? Colors.danger : (color || Colors.primary)} />
      </View>
      <Text style={[styles.menuLabel, isDestructive && { color: Colors.danger }]}>{label}</Text>
      {value ? <Text style={styles.menuValue}>{value}</Text> : null}
      <MaterialIcons name="chevron-right" size={18} color={Colors.textMuted} style={{ marginLeft: 'auto' }} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();
  const { myBooking } = useRooms();
  const { tickets } = useTickets();

  const handleLogout = () => {
    showAlert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); router.replace('/login'); } },
    ]);
  };

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: Spacing.xxl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.full_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.badgeRow}>
          <Badge variant={user?.role as 'admin' | 'student'} />
          {myBooking ? <Badge variant="active" label={'Room ' + myBooking.room_number} /> : null}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{tickets.length}</Text>
          <Text style={styles.statLabel}>Tickets</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{tickets.filter(t => t.status === 'resolved').length}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{myBooking ? '1' : '0'}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
      </View>

      {/* Account Section */}
      <Text style={styles.sectionLabel}>Account</Text>
      <View style={styles.menuGroup}>
        <MenuItem icon="person" label="Full Name" value={user?.full_name} color={Colors.primary} />
        <MenuItem icon="email" label="Email" value={user?.email} color={Colors.info} />
        {user?.phone ? <MenuItem icon="phone" label="Phone" value={user.phone} color={Colors.success} /> : null}
        {user?.room_number ? <MenuItem icon="bed" label="Room" value={`Room ${user.room_number}`} color={Colors.adminColor} /> : null}
      </View>

      {/* Settings Section */}
      <Text style={styles.sectionLabel}>Settings</Text>
      <View style={styles.menuGroup}>
        <MenuItem icon="notifications" label="Notifications" color={Colors.warning} onPress={() => showAlert('Coming Soon', 'Push notifications will be available after connecting to real backend.')} />
        <MenuItem icon="lock" label="Change Password" color={Colors.primary} onPress={() => showAlert('Coming Soon', 'Password management will be available with real authentication.')} />
        <MenuItem icon="language" label="Language" value="English" color={Colors.info} />
      </View>

      {/* About Section */}
      <Text style={styles.sectionLabel}>About</Text>
      <View style={styles.menuGroup}>
        <MenuItem icon="info" label="App Version" value="1.0.0 Beta" color={Colors.textMuted} />
        <MenuItem icon="description" label="Terms of Service" color={Colors.textMuted} onPress={() => showAlert('Terms', 'This is a demo app for hostel management.')} />
        <MenuItem icon="shield" label="Privacy Policy" color={Colors.textMuted} onPress={() => showAlert('Privacy', 'Your data is stored locally in this demo version.')} />
      </View>

      {/* Logout */}
      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}
      >
        <MaterialIcons name="logout" size={20} color={Colors.danger} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>

      {/* Demo note */}
      <Text style={styles.demoNote}>
        HostelHub v1.0 · Demo Mode{'\n'}Data is stored locally on device
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primaryMuted, borderWidth: 3, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, ...Shadow.md },
  avatarText: { fontSize: 28, fontWeight: '700', color: Colors.primary },
  name: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  email: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm },
  badgeRow: { flexDirection: 'row', gap: Spacing.sm },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.surfaceBorder, paddingVertical: Spacing.md, marginBottom: Spacing.lg, ...Shadow.sm },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.surfaceBorder },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm, marginTop: Spacing.sm },
  menuGroup: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.surfaceBorder, marginBottom: Spacing.md, overflow: 'hidden', ...Shadow.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder },
  menuIcon: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  menuLabel: { fontSize: FontSize.md, color: Colors.textPrimary, flex: 1 },
  menuValue: { fontSize: FontSize.sm, color: Colors.textMuted, marginRight: Spacing.sm },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.dangerMuted, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.danger + '44', marginBottom: Spacing.md },
  logoutText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.danger },
  demoNote: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
});
