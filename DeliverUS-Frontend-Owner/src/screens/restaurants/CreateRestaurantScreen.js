/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Image, Platform, Pressable, ScrollView, StyleSheet, View, Switch } from 'react-native'
import TextRegular from '../../components/TextRegular'
import InputItem from '../../components/InputItem'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { Formik } from 'formik'
import * as ExpoImagePicker from 'expo-image-picker'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import restaurantBackground from '../../../assets/restaurantBackground.jpeg'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DropDownPicker from 'react-native-dropdown-picker'
import { getRestaurantCategories } from '../../api/RestaurantEndpoints'
import { showMessage } from 'react-native-flash-message'
export default function CreateRestaurantScreen () {
  const initialRestaurantValues = { name: null, address: null, postalCode: null, url: null, shippingCosts: null, email: null, phone: null, restaurantCategoryId: null }
  const [restaurantCategories, setRestaurantCategories] = useState([])
  const [open, setOpen] = useState(false)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])

  const pickImage = async (onSuccess) => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!result.canceled) {
      if (onSuccess) {
        onSuccess(result)
      }
    }
  }

  useEffect(() => {
    async function fetchRestaurantCategories () {
      try {
        const fetchedRestaurantCategories = await getRestaurantCategories()
        const fetchedRestaurantCategoriesReshaped = fetchedRestaurantCategories.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        setRestaurantCategories(fetchedRestaurantCategoriesReshaped)
      } catch (err) {
        showMessage({
          message: `There was an error while retrieving restaurant categories ${err}`,
          type: 'error',
          style: GlobalStyles.flashStyle,
          textStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchRestaurantCategories()
  })

  return (
    <Formik initialValues={initialRestaurantValues}>
      {({ setFieldValue, values }) => (
    <ScrollView>
    <View style={{ alignItems: 'left' }}>
      <View style={{ width: '60%' }}>
        <InputItem
          name= 'name'
          label= 'Name'
        />
        <InputItem
        name='description'
        label='Description'
      />
      <InputItem
        name='address'
        label='Address'
      />
      <InputItem
        name='postalCode'
        label='PostalCode'
      />
      <InputItem
        name='url'
        label='URL'
      />
      <InputItem
        name='sphippingCosts'
        label='ShippingCosts'
      />
      <InputItem
        name='email'
        label='Email'
      />
      <InputItem
        name='phone'
        label='Phone'
      />
      <DropDownPicker
      open={open}
      value= {values.restaurantCategoryId}
      items={restaurantCategories}
      setOpen={setOpen}
      onSelectItem={ item => {
        setFieldValue('restaurantCategoryId', item.value)
      }}
      setItems={setRestaurantCategories}
      placeholder='Select the restaurant category'
      containerStyle={{ height: 40, marginTop: 20 }}
      style={{ backgroundColor: GlobalStyles.brandBackground }}
      dropDownStyle= {{ backgroundColor: '#fafafa' }}
      />

      <TextRegular style= {styles.switch}>
        Is it available?
      </TextRegular>
      <Switch
        trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
        thumbColor={values.availability ? GlobalStyles.brandSecondary : '#f4f3f4'}
        value={ values.availability}
        style={ styles.switch}
        onValueChange={ value => setFieldValue('availability', value)}
      />
        <Pressable onPress={() =>
          pickImage(
            async result => {
              await setFieldValue('logo', result)
            }
          )
        }
          style= { styles.imagePicker}
        >
          <TextRegular>Logo: </TextRegular>
          <Image style= { styles.image} source={ values.logo ? { uri: values.logo.assets[0].uri } : restaurantLogo} />
        </Pressable>

        <Pressable onPress={() =>
          pickImage(
            async result => {
              await setFieldValue('heroImage', result)
            }
          )
        }
          style= { styles.imagePicker}
        >
          <TextRegular>Hero image: </TextRegular>
          <Image style= { styles.image} source={ values.heroImage ? { uri: values.heroImage.assets[0].uri } : restaurantBackground} />
        </Pressable>

        <Pressable
          onPress={() => console.log('Button pressed')}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandPrimaryTap
                : GlobalStyles.brandPrimary
            },
            styles.button
          ]}>
          <View style= {[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name= 'content-save' color={'white'} size={20}/>
          <TextRegular textStyle={styles.text}>
           Save
          </TextRegular>
          </View>
        </Pressable>
      </View>
    </View>
    </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  },
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 80
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  },
  switch: {
    marginTop: 20
  }
})
