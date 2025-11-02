import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '../services/vtexApi';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [q, setQ] = useState('');
  const { data, isLoading, error, refetch } = useQuery(['products', q], () => searchProducts(q, 1, 24));

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchRow}>
        <TextInput placeholder="Buscar produtos..." value={q} onChangeText={setQ} style={styles.searchInput} />
        <TouchableOpacity onPress={() => refetch()} style={styles.btn}>
          <Text style={{ color: '#fff' }}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={[styles.btn, { marginLeft: 8 }]}>
          <Text style={{ color: '#fff' }}>Carrinho</Text>
        </TouchableOpacity>
      </View>

      {isLoading && <View style={styles.center}><ActivityIndicator size="large" /></View>}
      {error && <View style={styles.center}><Text>Erro ao carregar produtos</Text></View>}

      <FlatList
        contentContainerStyle={styles.container}
        data={data || []}
        keyExtractor={(item: any) => String(item.productId)}
        numColumns={2}
        renderItem={({ item }: any) => {
          const image = item.items?.[0]?.images?.[0]?.imageUrl;
          return (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Product', { slug: item.link })}>
              {image ? <Image source={{ uri: image }} style={styles.image} /> : <View style={[styles.image, { backgroundColor: '#eee' }]} />}
              <Text numberOfLines={2} style={styles.title}>{item.productName}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={{ padding: 16 }}>Nenhum produto encontrado</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8 },
  card: { flex: 1, margin: 8, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', padding: 8, elevation: 2 },
  image: { width: '100%', height: 120, borderRadius: 8 },
  title: { marginTop: 8, fontSize: 14, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchRow: { flexDirection: 'row', padding: 8, alignItems: 'center' },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 8 },
  btn: { backgroundColor: '#1976d2', padding: 8, borderRadius: 8, marginLeft: 8 },
});