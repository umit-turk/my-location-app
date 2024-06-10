"use client"
import { Box, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { NavigationBoxProps } from '../types/navigationBox';
import { useEffect, useState } from 'react';

const NavigationBox: React.FC<NavigationBoxProps> = ({ title, route }) => {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const handleClick = () => {
        router.push(route);
    };

    return (
        <Box mb={4}>
            <Button onClick={handleClick}>
                {title}
            </Button>
        </Box>
    );
};

export default NavigationBox;
