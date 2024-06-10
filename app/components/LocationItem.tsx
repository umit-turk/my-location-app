"use client"
import { Box, Button, Flex, GridItem, Text, Tooltip, useMediaQuery } from '@chakra-ui/react';
import { LocationItemProps } from '../types/LocationItemProps';
import useMounted from '../hooks/useMounted';

const LocationItem: React.FC<LocationItemProps> = ({ location, open, toggle, edit, remove }) => {
    const isMounted = useMounted();
    const [isSmallerThan1024] = useMediaQuery("(max-width: 1024px)");
    if (!isMounted) {
        return null;
    }
    return (
        <GridItem border="1px" borderColor="gray.200" p={2} alignItems="center" borderRadius="md">
            <Flex alignItems="center" justifyContent="space-between">
                <Box
                    width="20px"
                    height="20px"
                    bgColor={location.color}
                    borderRadius="50%"
                    mr={2}
                    onClick={toggle}
                    cursor="pointer"
                />
                <Flex flex={1} alignItems='flex-start' className='' flexDirection={isSmallerThan1024 ? 'column' : 'row'}>
                    <Tooltip label={location.name} isDisabled={location.name.length <= 20} hasArrow>
                        <Text width="150px" isTruncated>
                            {location.name}
                        </Text>
                    </Tooltip>
                    {open && (
                        <Text ml={isSmallerThan1024 ? 0 : 2}>
                            Latitude: {location.lat.toFixed(2)}, Longitude: {location.lng.toFixed(2)}
                        </Text>
                    )}
                </Flex>
                <Box>
                    <Button ml={0} onClick={edit}>
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
