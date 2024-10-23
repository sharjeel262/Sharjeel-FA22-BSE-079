import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SURAH_API_URL = 'https://api.alquran.cloud/v1/surah';
const QURAN_DETAILS_API_URL = 'https://api.alquran.cloud/v1/quran/en.asad';

const QuranApp = () => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [surahDetails, setSurahDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('surahs');
        if (storedData) {
          setSurahs(JSON.parse(storedData));
        } else {
          const response = await fetch(SURAH_API_URL);
          const result = await response.json();
          setSurahs(result.data);
          await AsyncStorage.setItem('surahs', JSON.stringify(result.data));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchSurahDetails = async (surahNumber) => {
    try {
      const response = await fetch(QURAN_DETAILS_API_URL);
      const result = await response.json();
      const selectedSurahData = result.data.surahs.find((s) => s.number === surahNumber);
      setSurahDetails(selectedSurahData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSurahClick = (surah) => {
    if (selectedSurah?.number === surah.number) {
      setSelectedSurah(null);
      setSurahDetails(null);
    } else {
      setSelectedSurah(surah);
      fetchSurahDetails(surah.number);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Assalamualaikum</Text>
        <Text style={styles.userName}>Muhammad Sharjeel</Text>
      </View>

      <View style={styles.lastRead}>
        <View>
          <Text style={styles.lastReadTitle}>Last Read</Text>
          <Text style={styles.surahName}>Al-Fatihah</Text>
          <Text style={styles.ayahNumber}>Ayah No: 1</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Surahs</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        surahs.map((surah) => (
          <View key={surah.number}>
            <TouchableOpacity onPress={() => handleSurahClick(surah)}>
              <View style={styles.surahItem}>
                <View style={styles.pentagon}>
                  <Text style={styles.surahNumber}>{surah.number}</Text>
                </View>
                <View style={styles.surahInfo}>
                  <Text style={styles.surahText}>{surah.englishName} ({surah.ayahs} Verses)</Text>
                  <Text style={styles.arabicText}>{surah.name}</Text>
                </View>
              </View>
            </TouchableOpacity>

            {selectedSurah?.number === surah.number && surahDetails && (
              <View style={styles.surahDetails}>
                <Text style={styles.detailText}>Surah: {surahDetails.englishName} ({surahDetails.name})</Text>
                <Text style={styles.detailText}>Revelation: {surahDetails.revelationType}</Text>
                <Text style={styles.detailText}>Total Verses: {surahDetails.numberOfAyahs}</Text>
                <Text style={styles.detailText}>Translation: {surahDetails.ayahs[0].text}</Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f3e5f5' },
  header: { marginBottom: 20 },
  greeting: { fontSize: 18, color: '#7b42f5' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  lastRead: {
    padding: 15,
    backgroundColor: 'rgba(123, 66, 245, 0.1)',
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastReadTitle: { fontSize: 16, color: '#7b42f5' },
  surahName: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  ayahNumber: { fontSize: 16, color: '#555' },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#7b42f5', marginVertical: 20 },
  surahItem: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  pentagon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7b42f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahNumber: { color: '#fff', fontWeight: 'bold' },
  surahInfo: { marginLeft: 10 },
  surahText: { fontSize: 18, color: '#000' },
  arabicText: { fontSize: 20, color: '#7b42f5', alignSelf: 'flex-end' },
  surahDetails: {
    padding: 10,
    backgroundColor: 'rgba(123, 66, 245, 0.1)',
    borderRadius: 8,
    marginBottom: 10,
  },
  detailText: { fontSize: 16, color: '#333' },
});

export default QuranApp;
