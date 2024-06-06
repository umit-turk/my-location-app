"use client";
import { Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import NavigationBox from './components/NavigationBox';

export default function Home() {
  const locations = useSelector((state: RootState) => state.locations.locations);

  return (
    <Flex direction="column" align="center" justify="center" height="100vh">
      <NavigationBox title="Add Location" route="/add-location" />
      <NavigationBox title="Show Locations" route="/show-locations" />
      <NavigationBox 
        title="Routes Map" 
        route="/routes-map" 
        condition={locations.length > 0} 
        alertMessage="No locations available" 
      />
    </Flex>
  );
}
