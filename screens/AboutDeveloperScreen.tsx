import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function AboutDeveloperScreen() {
  const { colors } = useTheme();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const ContactCard = ({ icon, label, value, onPress, color }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 14,
      }}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: color + '20',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: colors.subtext, marginBottom: 2 }}>{label}</Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <Ionicons name="open-outline" size={18} color={colors.subtext} />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View
        style={{
          backgroundColor: colors.primary,
          paddingTop: 40,
          paddingBottom: 60,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: 'rgba(255,255,255,0.25)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            borderWidth: 4,
            borderColor: 'rgba(255,255,255,0.3)',
          }}
        >
          <Ionicons name="code-slash" size={48} color="#fff" />
        </View>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 4 }}>
          Ritesh Vishwakarma
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, marginBottom: 2 }}>
          Full Stack Developer
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 8 }}>
          React Native • Expo Developer
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Ionicons name="location" size={14} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Pune, India</Text>
        </View>
      </View>

      {/* Info Card */}
      <View
        style={{
          backgroundColor: colors.surface,
          marginHorizontal: 16,
          marginTop: -30,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
          About This Project
        </Text>
        <Text style={{ fontSize: 14, color: colors.subtext, lineHeight: 22, marginBottom: 16 }}>
          PetMart is a full-stack e-commerce mobile application built with React Native, Expo, and
          Firebase. This project showcases modern app development practices, clean UI/UX design, and
          robust backend integration.
        </Text>

        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 10 }}>
          Tech Stack Used:
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['React Native', 'TypeScript', 'Firebase', 'Expo', 'Context API', 'Cloudinary'].map((tech) => (
            <View
              key={tech}
              style={{
                backgroundColor: colors.primary + '15',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>{tech}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Education */}
      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: colors.subtext,
            marginBottom: 12,
            letterSpacing: 0.5,
          }}
        >
          EDUCATION
        </Text>
        <View
          style={{
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="school-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                Bachelor of Computer Applications
              </Text>
              <Text style={{ fontSize: 13, color: colors.subtext, marginBottom: 2 }}>
                Ajeenkya DY Patil University, Pune
              </Text>
              <Text style={{ fontSize: 12, color: colors.subtext }}>
                School of Engineering
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Location */}
      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: colors.subtext,
            marginBottom: 12,
            letterSpacing: 0.5,
          }}
        >
          LOCATION
        </Text>
        <View
          style={{
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.accent + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="location" size={22} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 }}>
                Current Location
              </Text>
              <Text style={{ fontSize: 13, color: colors.subtext }}>Pune, Maharashtra, India</Text>
            </View>
          </View>
          
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="home" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 }}>
                Hometown
              </Text>
              <Text style={{ fontSize: 13, color: colors.subtext }}>Gorakhpur, Uttar Pradesh, India</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Hire Me Section */}
      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: colors.subtext,
            marginBottom: 12,
            letterSpacing: 0.5,
          }}
        >
          HIRE ME
        </Text>
        <View
          style={{
            backgroundColor: colors.card,
            padding: 20,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.primary + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="briefcase" size={26} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 2 }}>
                Available for Work
              </Text>
              <Text style={{ fontSize: 13, color: colors.subtext }}>
                Open to freelance & full-time opportunities
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 }}>
            Expertise:
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {[
              'Full Stack Development',
              'React Native',
              'Expo',
              'React.js',
              'Django',
              'Node.js',
              'TypeScript',
              'JavaScript',
              'Python',
              'Java',
              'C++',
              'C',
              'Firebase',
              'MongoDB',
              'SQL',
              'REST APIs',
              'Tailwind CSS',
              'Bootstrap',
            ].map((skill) => (
              <View
                key={skill}
                style={{
                  backgroundColor: colors.primary + '15',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.primary + '30',
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>
                  {skill}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={{
              backgroundColor: colors.primary + '10',
              padding: 14,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.primary + '30',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                What I Can Do For You:
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: colors.subtext, lineHeight: 20, marginLeft: 26 }}>
              • Build cross-platform mobile apps (iOS & Android){'\n'}
              • Develop responsive web applications (React, Django){'\n'}
              • Create REST APIs and backend services{'\n'}
              • Database design & management (SQL, MongoDB){'\n'}
              • Firebase & cloud integration{'\n'}
              • UI/UX implementation (Tailwind, Bootstrap){'\n'}
              • Full-stack solutions from scratch{'\n'}
              • App deployment & maintenance
            </Text>
          </View>
        </View>
      </View>

      {/* Contact */}
      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: colors.subtext,
            marginBottom: 12,
            letterSpacing: 0.5,
          }}
        >
          GET IN TOUCH
        </Text>

        <ContactCard
          icon="logo-github"
          label="GitHub"
          value="RiteshhVishwakarma"
          color="#333"
          onPress={() => openLink('https://github.com/RiteshhVishwakarma')}
        />

        <ContactCard
          icon="logo-linkedin"
          label="LinkedIn"
          value="Ritesh Vishwakarma"
          color="#0077b5"
          onPress={() =>
            openLink('https://www.linkedin.com/in/ritesh-vishwakarma-272907229/')
          }
        />

        <ContactCard
          icon="mail"
          label="Email (Primary)"
          value="riteshsunstone@gmail.com"
          color="#ea4335"
          onPress={() => openLink('mailto:riteshsunstone@gmail.com')}
        />

        <ContactCard
          icon="mail-outline"
          label="Email (Secondary)"
          value="raajsharma8896@gmail.com"
          color="#ea4335"
          onPress={() => openLink('mailto:raajsharma8896@gmail.com')}
        />

        <ContactCard
          icon="call"
          label="Phone"
          value="+91 7565025005"
          color="#25D366"
          onPress={() => openLink('tel:+917565025005')}
        />
      </View>

      {/* Footer */}
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 32,
          padding: 20,
          backgroundColor: colors.primary + '10',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.primary + '30',
          alignItems: 'center',
        }}
      >
        <Ionicons name="rocket" size={32} color={colors.primary} style={{ marginBottom: 12 }} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: '800',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 6,
          }}
        >
          Let's Build Something Amazing!
        </Text>
        <Text style={{ fontSize: 13, color: colors.subtext, textAlign: 'center', lineHeight: 20, marginBottom: 16 }}>
          Have a project in mind? Let's discuss how I can help bring your ideas to life.
        </Text>
        
        <TouchableOpacity
          onPress={() => openLink('mailto:riteshsunstone@gmail.com?subject=Project Inquiry&body=Hi Ritesh, I would like to discuss a project with you.')}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="mail" size={18} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
            Get In Touch
          </Text>
        </TouchableOpacity>
      </View>

      {/* Made with Love */}
      <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 13, color: colors.subtext, textAlign: 'center' }}>
          Made with ❤️ by Ritesh Vishwakarma
        </Text>
        <Text style={{ fontSize: 12, color: colors.subtext, textAlign: 'center', marginTop: 4 }}>
          © 2024 PetMart. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}
