import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function PrivacyScreen() {
  const { colors } = useTheme();

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: colors.subtext, lineHeight: 22 }}>
        {children}
      </Text>
    </View>
  );

  const BulletPoint = ({ children }: { children: string }) => (
    <Text style={{ fontSize: 14, color: colors.subtext, lineHeight: 22, marginLeft: 16 }}>
      • {children}
    </Text>
  );

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
        Privacy Policy
      </Text>
      <Text style={{ fontSize: 13, color: colors.subtext, marginBottom: 24 }}>
        Last updated: April 20, 2026
      </Text>

      <Section title="1. Introduction">
        At PetMart, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
        disclose, and safeguard your information when you use our mobile application. Please read this 
        policy carefully. If you do not agree with the terms, please discontinue use of the app.
      </Section>

      <Section title="2. Information We Collect">
        We collect information that you provide directly to us and information automatically collected 
        when you use our app:
      </Section>
      
      <View style={{ marginBottom: 24, marginLeft: 8 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
          Personal Information:
        </Text>
        <BulletPoint>Name and contact information (email, phone number)</BulletPoint>
        <BulletPoint>Delivery address and billing information</BulletPoint>
        <BulletPoint>Account credentials (username, password)</BulletPoint>
        <BulletPoint>Payment information (processed securely by payment gateways)</BulletPoint>
        <BulletPoint>Order history and purchase preferences</BulletPoint>
        
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, marginTop: 16, marginBottom: 8 }}>
          Automatically Collected Information:
        </Text>
        <BulletPoint>Device information (model, operating system, unique identifiers)</BulletPoint>
        <BulletPoint>Usage data (pages viewed, features used, time spent)</BulletPoint>
        <BulletPoint>Location data (with your permission, for delivery purposes)</BulletPoint>
        <BulletPoint>App performance and crash reports</BulletPoint>
      </View>

      <Section title="3. How We Use Your Information">
        We use the collected information for various purposes:
      </Section>
      
      <View style={{ marginBottom: 24, marginLeft: 8 }}>
        <BulletPoint>Process and fulfill your orders</BulletPoint>
        <BulletPoint>Communicate with you about orders, promotions, and updates</BulletPoint>
        <BulletPoint>Improve our app functionality and user experience</BulletPoint>
        <BulletPoint>Personalize product recommendations</BulletPoint>
        <BulletPoint>Prevent fraud and enhance security</BulletPoint>
        <BulletPoint>Comply with legal obligations</BulletPoint>
        <BulletPoint>Send promotional offers (you can opt-out anytime)</BulletPoint>
      </View>

      <Section title="4. Information Sharing & Disclosure">
        We do not sell your personal information. We may share your information only in the following 
        circumstances:
      </Section>
      
      <View style={{ marginBottom: 24, marginLeft: 8 }}>
        <BulletPoint>With delivery partners to fulfill your orders</BulletPoint>
        <BulletPoint>With payment processors to complete transactions</BulletPoint>
        <BulletPoint>With service providers who assist in app operations</BulletPoint>
        <BulletPoint>When required by law or to protect our rights</BulletPoint>
        <BulletPoint>In connection with a business transfer or merger</BulletPoint>
        <BulletPoint>With your explicit consent</BulletPoint>
      </View>

      <Section title="5. Data Security">
        We implement industry-standard security measures to protect your personal information. This 
        includes encryption, secure servers, and regular security audits. However, no method of 
        transmission over the internet is 100% secure, and we cannot guarantee absolute security.
      </Section>

      <Section title="6. Your Data Rights">
        You have the following rights regarding your personal information:
      </Section>
      
      <View style={{ marginBottom: 24, marginLeft: 8 }}>
        <BulletPoint>Access: Request a copy of your personal data</BulletPoint>
        <BulletPoint>Correction: Update or correct inaccurate information</BulletPoint>
        <BulletPoint>Deletion: Request deletion of your account and data</BulletPoint>
        <BulletPoint>Opt-out: Unsubscribe from marketing communications</BulletPoint>
        <BulletPoint>Data portability: Receive your data in a structured format</BulletPoint>
        <BulletPoint>Withdraw consent: Revoke permissions at any time</BulletPoint>
      </View>

      <Section title="7. Cookies & Tracking Technologies">
        We use cookies and similar tracking technologies to enhance your experience, analyze app usage, 
        and deliver personalized content. You can control cookie preferences through your device settings, 
        but disabling cookies may limit certain app features.
      </Section>

      <Section title="8. Third-Party Services">
        Our app may integrate with third-party services (e.g., Google Sign-In, Firebase, payment gateways). 
        These services have their own privacy policies, and we encourage you to review them. We are not 
        responsible for the privacy practices of third parties.
      </Section>

      <Section title="9. Children's Privacy">
        PetMart is not intended for children under 13 years of age. We do not knowingly collect personal 
        information from children. If you believe we have collected information from a child, please 
        contact us immediately, and we will delete it.
      </Section>

      <Section title="10. Data Retention">
        We retain your personal information for as long as necessary to fulfill the purposes outlined in 
        this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When 
        data is no longer needed, we securely delete or anonymize it.
      </Section>

      <Section title="11. International Data Transfers">
        Your information may be transferred to and processed in countries other than your own. We ensure 
        that such transfers comply with applicable data protection laws and that your data receives 
        adequate protection.
      </Section>

      <Section title="12. Push Notifications">
        With your permission, we may send push notifications about order updates, promotions, and app 
        features. You can disable notifications in your device settings at any time.
      </Section>

      <Section title="13. Changes to This Privacy Policy">
        We may update this Privacy Policy from time to time. We will notify you of significant changes 
        through the app or via email. Your continued use of PetMart after changes indicates acceptance 
        of the updated policy.
      </Section>

      <Section title="14. Your Consent">
        By using PetMart, you consent to the collection, use, and sharing of your information as 
        described in this Privacy Policy. If you do not agree, please discontinue use of the app.
      </Section>

      <Section title="15. Contact Us">
        If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, 
        please contact us:
        {'\n\n'}
        Email: riteshsunstone@gmail.com
        {'\n'}
        WhatsApp: +917565025005
        {'\n\n'}
        We value your privacy and are committed to protecting your personal information!
      </Section>

      <View style={{ 
        backgroundColor: colors.primary + '15', 
        padding: 16, 
        borderRadius: 12, 
        borderLeftWidth: 4, 
        borderLeftColor: colors.primary,
        marginBottom: 40 
      }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
          Quick Summary
        </Text>
        <Text style={{ fontSize: 13, color: colors.subtext, lineHeight: 20 }}>
          We collect your information to provide better service, never sell it to third parties, 
          use industry-standard security, and give you full control over your data. Your trust is 
          our priority!
        </Text>
      </View>
    </ScrollView>
  );
}
