import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { Error, Loader, SongCard } from "../components";
import { useGetSongsByCountryQuery } from "../redux/services/shazamCore";

const CountryTracks = () => {
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongsByCountryQuery(country);

  useEffect(() => {
    axios
      .get(
        "https://geo.ipify.org/api/v2/country?apiKey=at_THnrFgOhJAnzr10h06a4X2PpGXHCe&ipAddress=8.8.8.8"
      )
      .then((res) => setCountry(res?.data?.location.country))
      .catch((err) => {
        console.error("Error fetching country:", err);
        setCountry(""); // Clear country if fetch fails
      })
      .finally(() => setLoading(false));
  }, []);

  // Display loading indicator while fetching data
  if (isFetching && loading)
    return <Loader title="Loading Songs around you..." />;

  // Handle API error or missing country data
  if (error || !country) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Around you <span className="font-black">{country}</span>
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {/* Check if data exists before mapping over it */}
        {data &&
          data.map((song, i) => (
            <SongCard
              key={song.key}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={data}
              i={i}
            />
          ))}
      </div>
    </div>
  );
};

export default CountryTracks;
