import React, { useState, useEffect } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, FlatList, Share, Alert, TextInput, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Product, Review } from '../types';
import { formatINR } from '../utils/format';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getSimilarProducts } from '../services/productService';
import { getProductReviews, addReview, hasUserReviewed } from '../services/reviewService';
import ProductCard from '../components/ProductCard';
import { showSuccessToast } from '../utils/toast';
import { calculateOffer } from '../utils/offerCalculations';
import ImageZoom from '../components/ImageZoom';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export default function ProductDetail({ route, navigation }: Props) {
  const { product } = route.params;
  const { colors } = useTheme();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user, profile } = useAuth();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const wished = isWishlisted(product.id);
  
  // Calculate offer details
  const offer = product.mrp ? calculateOffer(product.mrp, product.price) : null;

  useEffect(() => {
    setAdded(false);
    setQty(1);
    getSimilarProducts(product).then(setSimilar);
    loadReviews();
    checkUserReview();
  }, [product.id]);

  const loadReviews = async () => {
    const productReviews = await getProductReviews(product.id);
    setReviews(productReviews);
  };

  const checkUserReview = async () => {
    if (user) {
      const hasReviewed = await hasUserReviewed(product.id, user.uid);
      setUserHasReviewed(hasReviewed);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    showSuccessToast(`${qty}x ${product.name} added to cart`);
    
    // Reset "Added" state after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on PetMart!\n\nPrice: ${formatINR(product.price)}\n\nGet it now!`,
        title: product.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to write a review');
      return;
    }

    if (reviewComment.trim().length < 10) {
      Alert.alert('Invalid Review', 'Please write at least 10 characters');
      return;
    }

    setSubmittingReview(true);
    try {
      await addReview(
        product.id,
        user.uid,
        profile?.name || user.displayName || 'Anonymous',
        reviewRating,
        reviewComment.trim()
      );
      
      showSuccessToast('Review submitted successfully!');
      setShowReviewModal(false);
      setReviewComment('');
      setReviewRating(5);
      loadReviews();
      setUserHasReviewed(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Image */}
        <View style={{ position: 'relative', backgroundColor: colors.surface }}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => setShowImageZoom(true)}
          >
            <Image source={{ uri: product.image }} style={{ width: '100%', height: 300, resizeMode: 'cover' }} />
            {/* Zoom hint */}
            <View style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: 'rgba(0,0,0,0.6)',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}>
              <Ionicons name="expand-outline" size={14} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Tap to zoom</Text>
            </View>
          </TouchableOpacity>
          
          {/* Action buttons */}
          <View style={{
            position: 'absolute',
            top: 14,
            right: 14,
            gap: 10,
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.surface, borderRadius: 20, padding: 8,
                elevation: 3, shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3,
              }}
              onPress={() => toggleWishlist(product)}
            >
              <Ionicons name={wished ? 'heart' : 'heart-outline'} size={22} color={wished ? colors.accent : colors.subtext} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: colors.surface, borderRadius: 20, padding: 8,
                elevation: 3, shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3,
              }}
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={22} color={colors.subtext} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Body */}
        <View style={{ backgroundColor: colors.surface, padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8, lineHeight: 26 }}>
            {product.name}
          </Text>

          {/* Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.success, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4 }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{product.rating || 4.5}</Text>
              <Ionicons name="star" size={11} color="#fff" />
            </View>
            <Text style={{ fontSize: 13, color: colors.subtext }}>
              {product.reviewCount || reviews.length} {(product.reviewCount || reviews.length) === 1 ? 'rating' : 'ratings'}
            </Text>
          </View>

          {/* Price */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.primary }}>{formatINR(product.price)}</Text>
            {offer?.hasOffer && (
              <View style={{ backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{offer.discountPercent}% OFF</Text>
              </View>
            )}
          </View>
          {offer?.hasOffer && (
            <Text style={{ fontSize: 13, color: colors.subtext, marginBottom: 16 }}>
              MRP <Text style={{ textDecorationLine: 'line-through' }}>{formatINR(product.mrp!)}</Text>
              {' '}· You save {formatINR(offer.savings)}
            </Text>
          )}

          {/* Quantity Selector */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>Quantity:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0, borderWidth: 1, borderColor: colors.border, borderRadius: 8, overflow: 'hidden' }}>
              <TouchableOpacity
                style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: qty <= 1 ? colors.border : colors.surface }}
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
              >
                <Ionicons name="remove" size={16} color={qty <= 1 ? colors.subtext : colors.text} />
              </TouchableOpacity>
              <Text style={{ paddingHorizontal: 16, fontSize: 15, fontWeight: '700', color: colors.text }}>{qty}</Text>
              <TouchableOpacity
                style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.surface }}
                onPress={() => setQty((q) => Math.min(10, q + 1))}
              >
                <Ionicons name="add" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 13, color: colors.subtext }}>
              Total: <Text style={{ color: colors.primary, fontWeight: '700' }}>{formatINR(product.price * qty)}</Text>
            </Text>
          </View>

          {/* Delivery */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, marginBottom: 16 }}>
            <Ionicons name="cube-outline" size={18} color={colors.primary} />
            <Text style={{ fontSize: 13, color: colors.text }}>
              Free delivery by <Text style={{ fontWeight: '700' }}>Tomorrow</Text>
            </Text>
          </View>

          {/* Description */}
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 }}>About this item</Text>
          <Text style={{ fontSize: 14, color: colors.subtext, lineHeight: 22, marginBottom: 16 }}>{product.description}</Text>

          {/* Highlights */}
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 }}>Highlights</Text>
          {['100% authentic product', 'Easy 7-day return policy', 'Vet recommended'].map((h) => (
            <View key={h} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={{ fontSize: 13, color: colors.text }}>{h}</Text>
            </View>
          ))}

          {/* Reviews Section */}
          <View style={{ marginTop: 24 }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 14 
            }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                Customer Reviews ({reviews.length})
              </Text>
              {user && !userHasReviewed && (
                <TouchableOpacity
                  onPress={() => setShowReviewModal(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: colors.primary + '15',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6,
                  }}
                >
                  <Ionicons name="create-outline" size={14} color={colors.primary} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>
                    Write Review
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {reviews.length === 0 ? (
              <View style={{
                backgroundColor: colors.card,
                padding: 20,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}>
                <Ionicons name="chatbubbles-outline" size={40} color={colors.border} />
                <Text style={{ fontSize: 14, color: colors.subtext, marginTop: 8 }}>
                  No reviews yet
                </Text>
                {user && (
                  <TouchableOpacity
                    onPress={() => setShowReviewModal(true)}
                    style={{
                      marginTop: 12,
                      backgroundColor: colors.primary,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
                      Be the first to review
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {reviews.slice(0, 3).map((review) => (
                  <View
                    key={review.id}
                    style={{
                      backgroundColor: colors.card,
                      padding: 14,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                      <View>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                          {review.userName}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                              key={star}
                              name={star <= review.rating ? 'star' : 'star-outline'}
                              size={12}
                              color="#f59e0b"
                            />
                          ))}
                        </View>
                      </View>
                      <Text style={{ fontSize: 11, color: colors.subtext }}>
                        {review.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        }) || 'Recently'}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13, color: colors.text, lineHeight: 20 }}>
                      {review.comment}
                    </Text>
                  </View>
                ))}
                {reviews.length > 3 && (
                  <TouchableOpacity
                    style={{
                      paddingVertical: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary }}>
                      View all {reviews.length} reviews
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Similar Products */}
          {similar.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 14 }}>Similar Products</Text>
              <FlatList
                data={similar}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 12, paddingRight: 16 }}
                renderItem={({ item }) => (
                  <ProductCard
                    product={item}
                    variant="horizontal"
                    onPress={() => navigation.replace('ProductDetail', { product: item })}
                  />
                )}
              />
            </View>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Image Zoom Modal */}
      <ImageZoom
        imageUri={product.image}
        visible={showImageZoom}
        onClose={() => setShowImageZoom(false)}
      />

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          justifyContent: 'flex-end' 
        }}>
          <View style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 30,
            maxHeight: '80%',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>
                Write a Review
              </Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16 }}>
              {/* Rating Stars */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 10 }}>
                Your Rating
              </Text>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setReviewRating(star)}
                  >
                    <Ionicons
                      name={star <= reviewRating ? 'star' : 'star-outline'}
                      size={32}
                      color="#f59e0b"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Review Comment */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 10 }}>
                Your Review
              </Text>
              <TextInput
                value={reviewComment}
                onChangeText={setReviewComment}
                placeholder="Share your experience with this product..."
                placeholderTextColor={colors.subtext}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                style={{
                  backgroundColor: colors.inputBg,
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 14,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                  minHeight: 120,
                  marginBottom: 20,
                }}
              />

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmitReview}
                disabled={submittingReview || reviewComment.trim().length < 10}
                style={{
                  backgroundColor: 
                    submittingReview || reviewComment.trim().length < 10
                      ? colors.border
                      : colors.primary,
                  paddingVertical: 14,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bottom Action Bar */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', gap: 10,
        backgroundColor: colors.surface,
        padding: 12, paddingBottom: 20,
        borderTopWidth: 1, borderTopColor: colors.border,
        elevation: 10, shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 6,
      }}>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={{
            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            gap: 6, paddingVertical: 13, borderRadius: 8,
            borderWidth: 2, borderColor: added ? colors.success : colors.primary,
          }}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={20} color={added ? colors.success : colors.primary} />
          <Text style={{ fontSize: 14, fontWeight: '700', color: added ? colors.success : colors.primary }}>
            {added ? 'Added' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 13, borderRadius: 8, backgroundColor: colors.primary }}
          onPress={() => { handleAddToCart(); navigation.navigate('Cart'); }}
        >
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
