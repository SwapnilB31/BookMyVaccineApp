import React, {useState} from 'react'
import {View, StyleSheet, TouchableOpacity,Text} from 'react-native'
import {Overlay, Button} from 'react-native-elements'
import DatePicker from 'react-native-date-picker'
import Icon from 'react-native-vector-icons/Fontisto'

const styles = StyleSheet.create({
    btn: {
        width :'100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems : "center"
    },
    header : {
        display : "flex",
        flexDirection: "row",
        borderBottomColor : "lightgray",
        borderBottomWidth : 1,
        marginBottom : 2,
        padding : 2,

    },
    headerText : {
        fontSize: 18,
        fontWeight : "bold"
    },
    modalActionBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop : 2,
        borderTopColor : "lightgray",
        borderTopWidth : 1,
    },
    closeButton : {
        color: "orangered"
    },
    dateText : {
        textAlign : "left",
        fontSize: 16
    },
    dateButton : {
        flexGrow: 1
    },
    addRightMargin : {
        marginRight : 10
    }
})

function CustomDatePicker({style, date, onDateChange, leftIcon}) {
    const [visible,setVisible] = useState(false)
    const [internalDate,setInternalDate] = useState(new Date())

    function handleSet() {
        if(dateToStr(date) !== dateToStr(internalDate))
            onDateChange(internalDate)
        setVisible(false)
    }

    function handleClose() {
        if(dateToStr(date) !== dateToStr(internalDate) && date !== null)
            setInternalDate(date)
        setVisible(false)
    }
 
    return (
        <View style={style}>
            <View style={styles.btn}>
                {
                    leftIcon && (
                        <TouchableOpacity
                            style={styles.addRightMargin}
                            onPress={() => setVisible(true)}
                        >
                            <Icon
                                name="date"
                                size={15}
                                color="#444"
                            />
                        </TouchableOpacity>
                    )
                }
                <TouchableOpacity
                    onPress={() => setVisible(true)}
                    style={styles.dateButton}
                >
                    <Text style={date === null ? [styles.dateText,{color : "#888"}] : [styles.dateText, {color : "#000"}]}>{dateToStr(date)}</Text>
                </TouchableOpacity>
                {
                    !leftIcon && (
                        <TouchableOpacity
                            onPress={() => setVisible(true)}
                        >
                            <Icon
                                name="date"
                                size={15}
                                color="#444"
                            />
                        </TouchableOpacity>
                    )
                
                }
            </View>
            
            <Overlay isVisible={visible} onBackdropPress={handleClose}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Pick a date</Text>
                </View>
                <DatePicker
                    date={internalDate}
                    onDateChange={setInternalDate}
                    mode="date"
                    androidVariant="iosClone"
                />
                <View style={styles.modalActionBar}>
                    <Button
                        title="SET"
                        type="clear"
                        onPress={handleSet}
                    /> 
                    <Button
                        title="CLOSE"
                        type="clear"
                        titleStyle={styles.closeButton}
                        onPress={handleClose}
                    />
                </View>
            </Overlay>
        </View>
    )
}

/**
 * 
 * @param {Date} date 
 */
 function dateToStr(date) {
    if(date === null) 
        return `---Pick a Date---`
    let day = date.getDate()
    day = day > 9 ? day : `0${day}`
    let month = date.getMonth() + 1
    month = month > 9 ? month : `0${month}`
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
}

export default CustomDatePicker