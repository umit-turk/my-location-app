"use client"
import NavigationBox from '@/app/components/NavigationBox';
import { RootState } from '@/store';
import { Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const locations = useSelector((state: RootState) => state.locations.locations);
    return (
        <Flex align="center" justify="center" gap={2} mt={5}>
            {pathname && pathname !== '/add-location' && (<NavigationBox title="Add Location" route="/add-location" />)}
            {pathname && pathname !== '/show-locations' && (
                <NavigationBox
                    condition={locations.length > 0}
                    title="Show Locations"
                    route="/show-locations"
                />
            )}
            {pathname && pathname !== '/routes-map' && (
                <NavigationBox
                    title="Routes Map"
                    route="/routes-map"
                    condition={locations.length > 0}
                    alertMessage="No locations available"
                />
            )}
        </Flex>
    );
}
