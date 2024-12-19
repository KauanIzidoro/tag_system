// PDFDocument.tsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { TableInformationsProps} from '../usertable';  // Supondo que você tenha esse tipo exportado

// Definir o estilo do PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  table: {
    width: 'auto',
    margin: 12,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: '20%',
    padding: 5,
    border: '1px solid #000',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
});

interface PDFDocumentProps {
  data: TableInformationsProps[];
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={styles.cell}>Nome</Text>
          <Text style={styles.cell}>Cargo</Text>
          <Text style={styles.cell}>Data e Horário</Text>
          <Text style={styles.cell}>Autorizado</Text>
          <Text style={styles.cell}>Local</Text>
        </View>
        {data.map((item, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.cell}>{item.nome}</Text>
            <Text style={styles.cell}>{item.cargo}</Text>
            <Text style={styles.cell}>
              {new Date(item.horarioEntrada).toLocaleString('pt-BR', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </Text>
            <Text style={styles.cell}>
              {item.tagAtiva ? 'Sim' : 'Não'}
            </Text>
            <Text style={styles.cell}>{item.local}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFDocument;