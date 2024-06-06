import { Box, Button, Flex, GridItem, ListItem, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { Location } from '../types/location';
import truncateText from '../helpers/truncateText';
import { LocationItemProps } from '../types/LocationItemProps';

const LocationItem: React.FC<LocationItemProps> = ({ location, open, onToggle, onEdit, onDelete }) => {
    const isTruncated = location.name.length > 20;
    return (
        <GridItem border="1px" borderColor="gray.200" p={2} alignItems={'center'} borderRadius="md">
            <Flex alignItems="center" justifyContent="space-between">
                <Box
                    width="20px"
                    height="20px"
                    bgColor={location.color}
                    borderRadius="50%"
                    mr={2}
                    onClick={onToggle}
                    cursor="pointer"
                />
                {isTruncated ? (
                    <Tooltip label={location.name}>
                        <Text flex="1">{truncateText(location.name, 20)}</Text>
                    </Tooltip>
                ) : (
                    <Text flex="1">{truncateText(location.name, 20)}</Text>
                )}
                {open && (
                    <Text flex="1">
                        Latitude: {location.lat.toFixed(2)}, Longitude: {location.lng.toFixed(2)}
                    </Text>
                )}
                <Button ml={2} onClick={onEdit}>
                    Edit
                </Button>
                <Button colorScheme='red' ml={2} onClick={onDelete}>
                    Delete
                </Button>
            </Flex>
        </GridItem>
    );
};

export default LocationItem;
