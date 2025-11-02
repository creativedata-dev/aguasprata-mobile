import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CartStore from '../store/cart';
import { createOrder } from '../services/vtexApi';

export default function CartScreen() {
  const items = CartStore.getItems();

  const handleCheckout = async () => {
    if (items.length === 0) return Alert.alert('Carrinho vazio');
    // Simplified order payload: in production follow VTEX Checkout API spec
    const orderPayload = {
      items: items.map((it: any) => ({
        id: it.skuId,
        quantity: 1,
        price: it.price
      })),
      clientProfileData: {
        email: 'guest@example.com'
      },
      shipping: {
        address: {
          postalCode: '01001000',
          city: 'São Paulo',
          state: 'SP',
          street: 'Av. Exemplo'
        }
      }
    };

    try {
      const resp = await createOrder(orderPayload);
      Alert.alert('Pedido criado', `OrderId: ${resp?.orderId || JSON.stringify(resp)}`);
      CartStore.clear();
    } catch (err: any) {
      Alert.alert('Erro no checkout', err?.message || String(err));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(i: any) => String(i.skuId)}
        renderItem={({ item }: any) => (
          <View style={styles.row}>
            <Text style={{ fontWeight: '600' }}>{item.productName}</Text>
            <Text>R$ {item.price}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ padding: 16 }}>Carrinho vazio</Text>}
      />
      <View style={{ padding: 12 }}>
        <TouchableOpacity style={styles.btn} onPress={handleCheckout}><Text style={{ color: '#fff' }}>Finalizar Compra (sandbox)</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  btn: { backgroundColor: '#388e3c', padding: 12, borderRadius: 8, alignItems: 'center' }
});