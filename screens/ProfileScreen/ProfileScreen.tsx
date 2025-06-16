import CustomText from "@/components/CustomText/CustomText";
import { GradientText } from "@/components/GradientText/GradientText";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { useLoginStore } from "@/services/stores/auth/useLoginStore";
import { ScrollView, StyleSheet, View } from "react-native";

interface ProfileFieldProps {
  label: string;
  value: string;
  isFirst?: boolean;
}

const ProfileField = ({ label, value, isFirst = false }: ProfileFieldProps) => (
  <View style={[styles.fieldContainer, isFirst && styles.firstField]}>
    <CustomText style={styles.label}>
      {label}
    </CustomText>
    <CustomText style={styles.value}>
      {value}
    </CustomText>
  </View>
);

export default function ProfileScreen() {
  const { user, loading } = useLoginStore();
  
  if (loading) {
    return (
      <LayoutScreen>
        <View style={styles.container}>
          <GradientText 
            colors={['rgb(162, 104, 255)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']} 
            style={styles.title}
          >
            Loading...
          </GradientText>
        </View>
      </LayoutScreen>
    );
  }

  const formattedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const reduceName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase()
  }

  return (
    <LayoutScreen>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <CustomText style={styles.avatar}>{reduceName(user.name)}</CustomText>
          </View>
          <GradientText 
            colors={['rgb(162, 104, 255)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']} 
            style={styles.name}
          >
            {user.name}
          </GradientText>
          <CustomText style={styles.username}>@{user.username}</CustomText>
        </View>

        <View style={styles.section}>
          <ProfileField 
            label="Email" 
            value={user.email} 
            isFirst
          />
          <ProfileField 
            label="Role" 
            value={user.role} 
          />
          <ProfileField 
            label="Member since" 
            value={formattedDate} 
          />
        </View>

        <View style={styles.footer}>
          <CustomText style={styles.footerText}>
            Made with ❤️ by Anthony
          </CustomText>
        </View>

      </ScrollView>
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(162, 104, 255, 0.5)',
  },
  avatar: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
  },
  fieldContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  firstField: {
    paddingTop: 0,
  },
  label: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    color: '#666666',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});