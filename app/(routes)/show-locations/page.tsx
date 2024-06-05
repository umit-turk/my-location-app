"use client"
import { useSelector } from 'react-redux';
import { Box, Button, List, ListItem, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';

const ShowLocation = () => {
  const locations = useSelector((state: RootState) => state.locations.locations);
  const router = useRouter();

  return (
    <Box p={4}>
      <Button mb={4} onClick={() => router.push('/add-location')}>Konum Ekle</Button>
      <List spacing={3}>
        {locations.map((location) => (
          <ListItem key={location.id}>
            <Box display="flex" alignItems="center">
              <Box
                width="20px"
                height="20px"
                bgColor={location.color}
                borderRadius="50%"
                mr={2}
              />
              <Text>{location.name}</Text>
              <Button
                ml="auto"
                onClick={() => router.push(`/edit-location/${location.id}`)}
              >
                Düzenle
              </Button>
            </Box>
            <Text ml={6}>Enlem: {location.lat}, Boylam: {location.lng}</Text>
          </ListItem>
        ))}
      </List>
      <Button mt={4} onClick={() => router.push('/route')}>Rota Göster</Button>
    </Box>
  );
};

export default ShowLocation;
