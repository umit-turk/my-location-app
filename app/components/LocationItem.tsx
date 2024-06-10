"use client"
import { Box, Button, Flex, GridItem, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { LocationItemProps } from '../types/LocationItemProps';

const LocationItem: React.FC<LocationItemProps> = ({ location, open, toggle, edit, remove }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <GridItem border="1px" borderColor="gray.200" p={2} alignItems="center" borderRadius="md">
            <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                    <Box
                        width="20px"
                        height="20px"
                        bgColor={location.color}
                        borderRadius="50%"
                        mr={2}
                        onClick={toggle}
                        cursor="pointer"
                    />
                    <Tooltip label={location.name} isDisabled={location.name.length <= 20} hasArrow>
                        <Text width="150px" isTruncated>
                            {location.name}
                        </Text>
                    </Tooltip>
                </Flex>
                {open && (
                    <Text flex="1" ml={2}>
                        Latitude: {location.lat.toFixed(2)}, Longitude: {location.lng.toFixed(2)}
                    </Text>
                )}
                <Box>
                    <Button ml={2} onClick={edit}>
                        Edit
                    </Button>
                    <Button colorScheme="red" ml={2} onClick={remove}>
                        Remove
                    </Button>
                </Box>
            </Flex>
        </GridItem>
    );
};

export default LocationItem;
