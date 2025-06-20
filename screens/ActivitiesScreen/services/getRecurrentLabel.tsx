import { Recurrence } from "@/entities/Task";
import { Text, View } from "react-native";

export const getRecurrenceLabel = (recurrence: Recurrence, styles: any, selectedDays?: number[]) => {
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    switch (recurrence) {
      case 'DAILY': 
        return <Text>Daily</Text>;
      case 'WEEKLY': 
        if (selectedDays?.length) {
          return (
            <View style={styles.daysContainer}>
              {fullDayNames.map((_, index) => (
                selectedDays?.includes(index) ? (
                  <View key={index} style={[styles.dayCircle, styles.dayCircleSelected]}>
                    <Text style={styles.dayLetter}>{dayNames[index]}</Text>
                  </View>
                ) : (
                  <View key={index} style={styles.dayCircle}>
                    <Text style={styles.dayLetterInactive}>{dayNames[index]}</Text>
                  </View>
                )
              ))}
            </View>
          );
        }
        return <Text>Weekly</Text>;
      case 'MONTHLY': 
        return <Text>Monthly</Text>;
      case 'YEARLY': 
        return <Text>Yearly</Text>;
      default: 
        return <Text>One Time</Text>;
    }
  };