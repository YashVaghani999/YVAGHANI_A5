import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import useSWR from 'swr';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store'; // Import your favouritesAtom
import Error from 'next/error';

export default function ArtworkCardDetail({ objectID }) {
  const [showAdded, setShowAdded] = useState(true);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);

  useEffect(() => {
    if (favouritesList.includes(objectID)) {
      setShowAdded(true);
    } else {
      setShowAdded(false);
    }
  }, [favouritesList, objectID]);

  const favouritesClicked = () => {
    if (showAdded) {
      setFavouritesList((current) => current.filter((fav) => fav !== objectID));
      setShowAdded(false);
    } else {
      setFavouritesList((current) => [...current, objectID]);
      setShowAdded(true);
    }
  };

  if (error) {
    return <Error statusCode={404} />;
  }

  if (data) {
    const {
      primaryImage,
      title,
      objectDate,
      classification,
      medium,
      artistDisplayName,
      creditLine,
      dimensions,
      artistWikidata_URL,
    } = data;

    return (
      <Card>
        {primaryImage && (
          <Card.Img src={primaryImage} alt={title} />
        )}
        <Card.Title>{title || 'N/A'}</Card.Title>
        <Card.Text>
          Date: {objectDate || 'N/A'}
          <br />
          Classification: {classification || 'N/A'}
          <br />
          Medium: {medium || 'N/A'}
          <br />
          Artist: {artistDisplayName || 'N/A'}
          <br />
          Credit Line: {creditLine || 'N/A'}
          <br />
          Dimensions: {dimensions || 'N/A'}
          <br />
          {artistDisplayName && (
            <a href={artistWikidata_URL} target="_blank" rel="noreferrer">
              wiki
            </a>
          )}
        </Card.Text>
        <Button
          variant={showAdded ? 'primary' : 'outline-primary'}
          onClick={favouritesClicked}
        >
          + Favourite {showAdded ? '(added)' : ''}
        </Button>
      </Card>
    );
  }

  return null;
}
