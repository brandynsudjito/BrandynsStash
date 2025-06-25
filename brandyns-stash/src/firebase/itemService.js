// src/firebase/itemService.js
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const itemsCollection = collection(db, "figures");

// Fetch all items with filtering and sorting
// Update the getItems function in itemService.js
export const getItems = async (searchTerm = "", sortKey = "", sortDirection = "ascending", selectedSeries = null) => {
  try {
    console.log("Starting query with params:", { searchTerm, sortKey, sortDirection, selectedSeries });
    
    let items = [];
    
    // If a specific series is selected, filter by that series first
    if (selectedSeries && selectedSeries !== "all") {
      const querySnapshot = await getDocs(itemsCollection);
      items = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(item => {
          if (!item.series) return false;
          const seriesArray = Array.isArray(item.series) ? item.series : [item.series];
          return seriesArray.includes(selectedSeries);
        });
      
      // If there's also a search term, filter further by name
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        items = items.filter(item => 
          item.name && item.name.toLowerCase().includes(searchTermLower)
        );
      }
    } else {
      // No specific series selected
      const searchTermLower = searchTerm.toLowerCase();
      // Get all documents and filter client-side
      const querySnapshot = await getDocs(itemsCollection);
      items = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(item => 
          item.name && item.name.toLowerCase().includes(searchTermLower)
        );
    }
    
    console.log(`Retrieved ${items.length} items before sorting`);
    
    // Apply sorting
    if (sortKey && items.length > 0) {
      if (sortKey === "name") {
        items.sort((a, b) => {
          const nameA = (a.name || "").toLowerCase();
          const nameB = (b.name || "").toLowerCase();
          return sortDirection === "ascending" 
            ? nameA.localeCompare(nameB) 
            : nameB.localeCompare(nameA);
        });
      } else if (sortKey === "series") {
        items.sort((a, b) => {
          // Use series if available, otherwise use first element of series array
          const seriesA = ((Array.isArray(a.series) ? a.series[0] : a.series) || "").toLowerCase();
          const seriesB = ((Array.isArray(b.series) ? b.series[0] : b.series) || "").toLowerCase();
          
          return sortDirection === "ascending" 
            ? seriesA.localeCompare(seriesB) 
            : seriesB.localeCompare(seriesA);
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    console.error("Error details:", error.code, error.message);
    return [];
  }
};

// Get a single item by ID
export const getItemById = async (id) => {
  try {
    const docRef = doc(db, "figures", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such item!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};

// Add this function to itemService.js
export const getAllSeries = async () => {
  try {
    const querySnapshot = await getDocs(itemsCollection);
    const allSeries = new Set();
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.series) {
        // Handle both array and string series
        const seriesArray = Array.isArray(data.series) ? data.series : [data.series];
        seriesArray.forEach(series => {
          if (series && series.trim()) {
            allSeries.add(series.trim());
          }
        });
      }
    });
    
    // Convert to array and sort alphabetically
    return Array.from(allSeries).sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("Error fetching series:", error);
    return [];
  }
};