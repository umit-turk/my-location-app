"use client"
import { useSelector } from 'react-redux';
import { Box, Button, List, ListItem, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { useState } from 'react';

interface Location {
    id: string;
    name: string;
    color: string;
    lat: number;
    lng: number;
}

const ShowLocation = () => {
    const [openLocationIds, setOpenLocationIds] = useState<string[]>([]);
    const locations = useSelector((state: RootState) => state.locations.locations);
    const router = useRouter();

    const toggleLocation = (location: Location) => {
        setOpenLocationIds((prevIds) => {
            if (prevIds.includes(location.id)) {
                return prevIds.filter((id) => id !== location.id);
            } else {
                return [...prevIds, location.id];
            }
        });
    }

    return (
        <Box p={4}>
            <Button mt={4} onClick={() => router.push('/route')}>Show Route</Button>
            <List spacing={3}>
                {locations.map((location: Location) => (
                    <ListItem key={location.id}>
                        <Box display="flex" alignItems="center">
                            <Box
                                width="20px"
                                height="20px"
                                bgColor={location.color}
                                borderRadius="50%"
                                mr={2}
                                onClick={() => toggleLocation(location)}
                            />
                            <Text>{location.name}</Text>
                            {openLocationIds.includes(location.id) && (
                                <Text ml={6}>Latitude: {location.lat}, Longitude: {location.lng}</Text>
                            )}
                            <Button
                                ml="auto"
                                onClick={() => router.push(`/edit-location/${location.id}`)}
                            >
                                Edit
                            </Button>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ShowLocation;
