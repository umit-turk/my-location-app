"use client"
import NavigationBox from '@/app/components/NavigationBox';
import { RootState } from '@/store';
import { Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/app/config/constants';

export default function Header() {
    const currentPath = usePathname();
    const { locations } = useSelector((state: RootState) => state.locationsReducer);

    const pageLinks = [
        { ...ROUTES.ADD_LOCATION, linkIsActive: currentPath !== ROUTES.ADD_LOCATION.route },
        { ...ROUTES.SHOW_LOCATIONS, linkIsActive: locations.length > 0 && currentPath !== ROUTES.SHOW_LOCATIONS.route },
        { ...ROUTES.ROUTES_MAP, linkIsActive: locations.length > 0 && currentPath !== ROUTES.ROUTES_MAP.route },
    ];

    return (
        <Flex align="center" justify="center" gap={2} mt={5}>
            {pageLinks.map((link, index) => (
                link.linkIsActive && <NavigationBox key={index} title={link.title} route={link.route} />
            ))}
        </Flex>
    );
}
