import React, { useState, useEffect, useRef } from "react";


import axios from "axios";
import Card from "./Card"

const BASE_URL = "http://deckofcardsapi.com/api/deck"

function DeckOfCards() {
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const timerRef = useRef(null);
    const [autoDraw, setAutoDraw] = useState(false);
    

    useEffect(function fetchDeckOnRequest() {
        async function fetchDeck() {
            const deckResult = await axios.get(`${BASE_URL}/new/shuffle`)
            setDeck(deckResult.data)
            console.log(deckResult.data.deck_id)
        }
        fetchDeck();
    }, [setDeck]);

    useEffect(function fetchCardOnRequest() {
        async function fetchCard() {
            let { deck_id } = deck;

            try {
                const cardResult = await axios.get(`${BASE_URL}/${deck_id}/draw`)
                if (cardResult.data.remaining === 0) {
                    setAutoDraw(false)
                    throw new Error("No cards left.")
                }

            const card = cardResult.data.cards[0];

            setCards(c => [
                ...c,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image,
                }
            ])
            console.log(cards)
            } catch (err) {
               alert(err)
            }
            
        };

        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
            await fetchCard();
        }, 100);
        }
        
        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    }

    const cardSet = cards.map(c => (
        <Card key={c.id} image={c.image} name={c.name} />
    ))

    return (
        <div className="deck">
            <div>
                <button onClick={toggleAutoDraw}>
                    {autoDraw ? 'Stop' : 'Keep'} drawing
                </button>
            </div>
            <div>{cardSet}</div>
        </div>
    )
}

export default DeckOfCards;