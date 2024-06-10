"use client"
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { useState } from 'react';
import LocationItem from '@/app/components/LocationItem';
import { deleteLocation } from '@/store/locationsSlice';
import { Location } from '@/app/types/location';
import { ROUTES, gridTemplateColumns } from '@/app/config/constants';



const ShowLocation = () => {
    const [openLocationIds, setOpenLocationIds] = useState<string[]>([]);
    const {locations} = useSelector((state: RootState) => state.locationsReducer);
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

    if(locations.length === 0){
        router.push(ROUTES.ADD_LOCATION.route)
    }

    return (
        <Box p={4}>
            <Grid templateColumns={gridTemplateColumns} gridGap={2}>
                {locations.map((location: Location) => (
                    <LocationItem
                        key={location.id}
                        location={location}
                        open={openLocationIds.includes(location.id)}
                        toggle={() => toggleLocation(location)}
                        edit={() => router.push(`/edit-location/${location.id}`)}
                        remove={() => dispatch(deleteLocation(location.id))}
                    />
                ))}
            </Grid>
        </Box>
    );
};

export default ShowLocation;
