import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getProductBySlug } from '../services/vtexApi';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import CartStore from '../store/cart';

type Props = NativeStackScreenProps<RootStackParamList, 'Product'>;

export default function ProductScreen({ route }: Props) {
  const { slug } = route.params;
  const { data, isLoading } = useQuery(['product', slug], () => getProductBySlug(slug));

  if (isLoading) return <View style={styles.center}><Text>Carregando...</Text></View>;
  if (!data) return <View style={styles.center}><Text>Produto não encontrado</Text></View>;

  const image = data.items?.[0]?.images?.[0]?.imageUrl;

  const addToCart = () => {
    const sku = data.items?.[0];
    if (!sku) return Alert.alert('Erro', 'SKU inválido');
    CartStore.addItem({
      productId: data.productId,
      productName: data.productName,
      skuId: sku.itemId,
      price: sku.sellers?.[0]?.commertialOffer?.Price || 0,
      image: image || ''
    });
    Alert.alert('Adicionado', 'Produto adicionado ao carrinho');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
      <Text style={styles.title}>{data.productName}</Text>
      <Text style={styles.desc}>{data.description}</Text>
      <TouchableOpacity style={styles.btn} onPress={addToCart}><Text style={{ color: '#fff' }}>Adicionar ao Carrinho</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 300, borderRadius: 8 },
  title: { marginTop: 12, fontSize: 20, fontWeight: '700' },
  desc: { marginTop: 8, color: '#444' },
  btn: { marginTop: 16, backgroundColor: '#1976d2', padding: 12, borderRadius: 8, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});