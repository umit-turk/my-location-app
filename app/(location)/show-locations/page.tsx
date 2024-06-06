"use client"
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { useState } from 'react';
import LocationItem from '@/app/components/LocationItem';
import { deleteLocation } from '@/store/locationsSlice';
import { Location } from '@/app/types/location';



const ShowLocation = () => {
    const [openLocationIds, setOpenLocationIds] = useState<string[]>([]);
    const locations = useSelector((state: RootState) => state.locations.locations);
    const router = useRouter();
    const dispatch = useDispatch()

    const toggleLocation = (location: Location) => {
        setOpenLocationIds(prevIds => {
            if (prevIds.includes(location.id)) {
                return prevIds.filter(id => id !== location.id);
            } else {
                return [...prevIds, location.id];
            }
        });
    };

    const gridTemplateColumns = {
        base: '1fr',
        lg: 'repeat(2, 1fr)',
    };

    if(locations.length === 0){
        router.push('/add-location')
    }

    return (
        <Box p={4}>
            <Grid templateColumns={gridTemplateColumns} gridGap={2}>
                {locations.map((location: Location) => (
                    <LocationItem
                        key={location.id}
                        location={location}
                        open={openLocationIds.includes(location.id)}
                        onToggle={() => toggleLocation(location)}
                        onEdit={() => router.push(`/edit-location/${location.id}`)}
                        onDelete={() => dispatch(deleteLocation(location.id))}
                    />
                ))}
            </Grid>
        </Box>
    );
};

export default ShowLocation;
