import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function TermsScreen() {
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

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
        Terms & Conditions
      </Text>
      <Text style={{ fontSize: 13, color: colors.subtext, marginBottom: 24 }}>
        Last updated: April 20, 2026
      </Text>

      <Section title="1. Welcome to PetMart">
        Welcome to PetMart, your one-stop destination for all pet care needs! By accessing or using our 
        mobile application, you agree to be bound by these Terms and Conditions. If you disagree with any 
        part of these terms, please do not use our app.
      </Section>

      <Section title="2. Account Registration">
        To access certain features of PetMart, you must create an account. You agree to provide accurate, 
        current, and complete information during registration. You are responsible for maintaining the 
        confidentiality of your account credentials and for all activities that occur under your account.
      </Section>

      <Section title="3. Product Information & Pricing">
        We strive to provide accurate product descriptions and pricing. However, we do not warrant that 
        product descriptions, pricing, or other content is accurate, complete, or error-free. We reserve 
        the right to correct any errors and to change or update information at any time without prior notice.
      </Section>

      <Section title="4. Orders & Payment">
        By placing an order through PetMart, you agree to pay the total amount including product price, 
        taxes, and delivery charges. We accept various payment methods as displayed in the app. All 
        transactions are processed securely through trusted payment gateways.
      </Section>

      <Section title="5. Delivery & Shipping">
        We aim to deliver your orders within the estimated timeframe. However, delivery times may vary 
        based on location and product availability. Free delivery is available on eligible orders. We are 
        not responsible for delays caused by circumstances beyond our control.
      </Section>

      <Section title="6. Returns & Refunds">
        We offer a 7-day easy return policy on most products. Items must be unused and in original 
        packaging. Refunds will be processed within 7-10 business days after we receive the returned item. 
        Certain products like pet food and medicines may have specific return conditions.
      </Section>

      <Section title="7. User Conduct">
        You agree not to use PetMart for any unlawful purpose or in any way that could damage, disable, 
        or impair the app. You must not attempt to gain unauthorized access to any part of the app, 
        other accounts, or computer systems connected to the app.
      </Section>

      <Section title="8. Intellectual Property">
        All content on PetMart, including text, graphics, logos, images, and software, is the property of 
        PetMart or its content suppliers and is protected by intellectual property laws. You may not 
        reproduce, distribute, or create derivative works without our express written permission.
      </Section>

      <Section title="9. Limitation of Liability">
        PetMart shall not be liable for any indirect, incidental, special, or consequential damages 
        arising from your use of the app or purchase of products. Our total liability shall not exceed 
        the amount you paid for the product in question.
      </Section>

      <Section title="10. Product Quality & Safety">
        We ensure all pet products meet quality standards. However, we recommend consulting with a 
        veterinarian before using any new products, especially medicines or supplements. We are not 
        responsible for allergic reactions or adverse effects unless caused by product defects.
      </Section>

      <Section title="11. Third-Party Links">
        PetMart may contain links to third-party websites or services. We are not responsible for the 
        content, privacy policies, or practices of any third-party sites. Your use of third-party 
        websites is at your own risk.
      </Section>

      <Section title="12. Modifications to Terms">
        We reserve the right to modify these Terms and Conditions at any time. Changes will be effective 
        immediately upon posting in the app. Your continued use of PetMart after changes constitutes 
        acceptance of the modified terms.
      </Section>

      <Section title="13. Termination">
        We may terminate or suspend your account and access to PetMart immediately, without prior notice, 
        if you breach these Terms and Conditions. Upon termination, your right to use the app will 
        immediately cease.
      </Section>

      <Section title="14. Governing Law">
        These Terms and Conditions are governed by and construed in accordance with the laws of India. 
        Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the 
        courts in your local jurisdiction.
      </Section>

      <Section title="15. Contact Us">
        If you have any questions about these Terms and Conditions, please contact us:
        {'\n\n'}
        Email: riteshsunstone@gmail.com
        {'\n'}
        WhatsApp: +917565025005
        {'\n\n'}
        We're here to help!
      </Section>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
