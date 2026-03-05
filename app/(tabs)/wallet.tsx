import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const transactions = [
  { id: 1, type: 'deposit', amount: 500, date: '2024-03-01', method: 'STC Pay' },
  { id: 2, type: 'payment', amount: 100, date: '2024-03-02', method: 'تصوير حفلة' },
  { id: 3, type: 'deposit', amount: 200, date: '2024-03-03', method: 'Urpay' },
  { id: 4, type: 'payment', amount: 150, date: '2024-03-04', method: 'تصوير رياضي' },
];

const paymentMethods = [
  { id: 'stc', name: 'STC Pay', icon: 'STC', color: '#4A148C' },
  { id: 'urpay', name: 'Urpay', icon: 'UR', color: '#00695C' },
  { id: 'mada', name: 'Mada', icon: 'MD', color: '#1B5E20' },
  { id: 'visa', name: 'Visa', icon: 'VI', color: '#1565C0' },
];

export default function WalletScreen() {
  const [balance, setBalance] = useState(450);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ صحيح');
      return;
    }
    if (!selectedMethod) {
      Alert.alert('خطأ', 'يرجى اختيار طريقة الدفع');
      return;
    }

    setBalance((prev) => prev + amount);
    Alert.alert('نجاح', `تم إيداع ${amount} ريال بنجاح`);
    setShowDeposit(false);
    setDepositAmount('');
    setSelectedMethod(null);
  };

  return (
    <LinearGradient colors={['#1E3A5F', '#0D1F3C']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceGradient}
          >
            <Text style={styles.balanceLabel}>رصيدك الحالي</Text>
            <Text style={styles.balanceAmount}>{balance} ريال</Text>
            <TouchableOpacity
              style={styles.depositButton}
              onPress={() => setShowDeposit(true)}
            >
              <Text style={styles.depositButtonText}>إيداع رصيد</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionIcon}>[TR]</Text>
            <Text style={styles.quickActionText}>تحويل</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionIcon}>[HI]</Text>
            <Text style={styles.quickActionText}>السجل</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionIcon}>[OF]</Text>
            <Text style={styles.quickActionText}>عروض</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>طرق الدفع المتاحة</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity key={method.id} style={styles.paymentMethod}>
                <View
                  style={[
                    styles.paymentIcon,
                    { backgroundColor: method.color },
                  ]}
                >
                  <Text style={styles.paymentIconText}>{method.icon}</Text>
                </View>
                <Text style={styles.paymentName}>{method.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>آخر المعاملات</Text>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionIcon}>
                <Text style={styles.transactionIconText}>
                  {transaction.type === 'deposit' ? '+' : '-'}
                </Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionMethod}>{transaction.method}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === 'deposit'
                    ? styles.depositAmount
                    : styles.paymentAmount,
                ]}
              >
                {transaction.type === 'deposit' ? '+' : '-'}
                {transaction.amount} ريال
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showDeposit} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>إيداع رصيد</Text>

            <TextInput
              style={styles.amountInput}
              placeholder="أدخل المبلغ"
              placeholderTextColor="#aaa"
              value={depositAmount}
              onChangeText={setDepositAmount}
              keyboardType="numeric"
              textAlign="center"
            />

            <Text style={styles.methodLabel}>اختر طريقة الدفع:</Text>
            <View style={styles.methodsGrid}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodOption,
                    selectedMethod === method.id && styles.methodOptionSelected,
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <Text style={styles.methodOptionIcon}>{method.icon}</Text>
                  <Text style={styles.methodOptionName}>{method.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDeposit}
              >
                <Text style={styles.confirmButtonText}>تأكيد</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeposit(false)}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceGradient: {
    padding: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 12,
  },
  depositButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  depositButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    width: '30%',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
    color: '#fff',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'right',
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentMethod: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentIconText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  paymentName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionIconText: {
    fontSize: 24,
    color: '#fff',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  transactionMethod: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  transactionDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  depositAmount: {
    color: '#4CAF50',
  },
  paymentAmount: {
    color: '#ff6b6b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E3A5F',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  amountInput: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  methodLabel: {
    color: '#B8D4E8',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'right',
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  methodOption: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76,175,80,0.2)',
  },
  methodOptionIcon: {
    fontSize: 18,
    marginBottom: 4,
    color: '#fff',
  },
  methodOptionName: {
    color: '#fff',
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
