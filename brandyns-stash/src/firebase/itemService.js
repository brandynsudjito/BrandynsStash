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
export const getItems = async (searchTerm = "", searchType = "all", sortKey = "", sortDirection = "ascending") => {
  try {
    console.log("Starting query with params:", { searchTerm, searchType, sortKey, sortDirection });
    
    // Start with a base query
    let q = query(itemsCollection);
    let items = [];
    
    // Apply search filter if a search term is provided
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      
      if (searchType === "name") {
        // Search by name
        q = query(
          itemsCollection,
          where("nameLower", ">=", searchTermLower),
          where("nameLower", "<=", searchTermLower + "\uf8ff")
        );
        
        // Execute the query
        const querySnapshot = await getDocs(q);
        items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } 
      else if (searchType === "series") {
        console.log("Searching by series:", searchTermLower);
        
        // For series search, we need a different approach since series is an array
        // Option 1: If you have array-contains index
        q = query(
          itemsCollection,
          where("seriesLower", "array-contains-any", [searchTermLower])
        );
        
        const querySnapshot = await getDocs(q);
        items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // If no results with exact match, try a more flexible client-side search
        if (items.length === 0) {
          console.log("No exact series matches, trying client-side filtering");
          
          // Get all items and filter client-side
          const allSnapshot = await getDocs(itemsCollection);
          const allItems = allSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          items = allItems.filter(item => {
            if (!item.series) return false;
            
            // Make sure series is treated as an array
            const seriesArray = Array.isArray(item.series) ? item.series : [item.series];
            
            // Check if any series contains the search term
            return seriesArray.some(series => 
              series.toLowerCase().includes(searchTermLower)
            );
          });
        }
      }
      else if (searchType === "all") {
        // For "all" search, we need to combine name and series searches
        
        // First, search by name
        const nameQuery = query(
          itemsCollection,
          where("nameLower", ">=", searchTermLower),
          where("nameLower", "<=", searchTermLower + "\uf8ff")
        );
        const nameSnapshot = await getDocs(nameQuery);
        const nameResults = nameSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Then, search by series
        const seriesQuery = query(
          itemsCollection,
          where("seriesLower", "array-contains-any", [searchTermLower])
        );
        const seriesSnapshot = await getDocs(seriesQuery);
        const seriesResults = seriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Combine results, removing duplicates
        const itemMap = new Map();
        [...nameResults, ...seriesResults].forEach(item => {
          itemMap.set(item.id, item);
        });
        items = Array.from(itemMap.values());
        
        // If few results, try client-side filtering for partial matches
        if (items.length < 5) {
          console.log("Few matches, trying client-side filtering");
          
          const allSnapshot = await getDocs(itemsCollection);
          const allItems = allSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          const filteredItems = allItems.filter(item => {
            // Check name for partial match
            if (item.name && item.name.toLowerCase().includes(searchTermLower)) {
              return true;
            }
            
            // Check series for partial match
            if (item.series) {
              const seriesArray = Array.isArray(item.series) ? item.series : [item.series];
              return seriesArray.some(series => 
                series.toLowerCase().includes(searchTermLower)
              );
            }
            
            return false;
          });
          
          // Add new matches that weren't in the original results
          filteredItems.forEach(item => {
            if (!itemMap.has(item.id)) {
              itemMap.set(item.id, item);
            }
          });
          
          items = Array.from(itemMap.values());
        }
      }
    } else {
      // No search term, get all items
      const querySnapshot = await getDocs(q);
      items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
    
    console.log(`Retrieved ${items.length} items before sorting`);
    
    // Apply sorting
    if (sortKey && items.length > 0) {
      if (sortKey === "name") {
        items.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return sortDirection === "ascending" 
            ? nameA.localeCompare(nameB) 
            : nameB.localeCompare(nameA);
        });
      } else if (sortKey === "series") {
        items.sort((a, b) => {
          // Use seriesFirst if available, otherwise use first element of series array
          const seriesA = a.seriesFirst || (Array.isArray(a.series) ? a.series[0] : a.series) || "";
          const seriesB = b.seriesFirst || (Array.isArray(b.series) ? b.series[0] : b.series) || "";
          
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