import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Review } from '../types';

const REVIEWS_COLLECTION = 'reviews';
const PRODUCTS_COLLECTION = 'products';

/**
 * Add a review for a product
 */
export async function addReview(
  productId: string,
  userId: string,
  userName: string,
  rating: number,
  comment: string
): Promise<void> {
  try {
    // Add review
    await addDoc(collection(db, REVIEWS_COLLECTION), {
      productId,
      userId,
      userName,
      rating,
      comment,
      createdAt: Timestamp.now(),
    });

    // Update product rating
    await updateProductRating(productId);
  } catch (error) {
    console.error('❌ Error adding review:', error);
    throw error;
  }
}

/**
 * Get reviews for a product
 */
export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    // Try with orderBy first (requires index)
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];
  } catch (error: any) {
    // If index error, fallback to query without orderBy
    if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
      console.warn('⚠️ Firestore index not created yet. Fetching reviews without sorting.');
      console.warn('📝 Create index here:', error?.message?.match(/https:\/\/[^\s]+/)?.[0]);
      
      try {
        // Fallback: query without orderBy (doesn't require index)
        const fallbackQuery = query(
          collection(db, REVIEWS_COLLECTION),
          where('productId', '==', productId)
        );
        
        const snapshot = await getDocs(fallbackQuery);
        const reviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Review[];
        
        // Sort manually in JavaScript
        return reviews.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime; // Descending order
        });
      } catch (fallbackError) {
        console.error('❌ Error fetching reviews (fallback):', fallbackError);
        return [];
      }
    }
    
    console.error('❌ Error fetching reviews:', error);
    return [];
  }
}

/**
 * Update product's average rating and review count
 */
async function updateProductRating(productId: string): Promise<void> {
  try {
    const reviews = await getProductReviews(productId);
    
    if (reviews.length === 0) {
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      rating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error('❌ Error updating product rating:', error);
  }
}

/**
 * Check if user has already reviewed a product
 */
export async function hasUserReviewed(
  productId: string,
  userId: string
): Promise<boolean> {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('productId', '==', productId),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('❌ Error checking user review:', error);
    return false;
  }
}

/**
 * Get user's review for a product
 */
export async function getUserReview(
  productId: string,
  userId: string
): Promise<Review | null> {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('productId', '==', productId),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Review;
  } catch (error) {
    console.error('❌ Error getting user review:', error);
    return null;
  }
}

/**
 * Update user's review
 */
export async function updateReview(
  reviewId: string,
  rating: number,
  comment: string
): Promise<void> {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(reviewRef, {
      rating,
      comment,
      updatedAt: Timestamp.now(),
    });

    // Get productId from review to update product rating
    const reviewDoc = await getDoc(reviewRef);
    if (reviewDoc.exists()) {
      const productId = reviewDoc.data().productId;
      await updateProductRating(productId);
    }
  } catch (error) {
    console.error('❌ Error updating review:', error);
    throw error;
  }
}

/**
 * Delete user's review
 */
export async function deleteReview(reviewId: string, productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, REVIEWS_COLLECTION, reviewId));
    await updateProductRating(productId);
  } catch (error) {
    console.error('❌ Error deleting review:', error);
    throw error;
  }
}
