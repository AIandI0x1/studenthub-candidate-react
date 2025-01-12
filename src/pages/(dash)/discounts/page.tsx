"use client"
// app/(dash)/discounts/DiscountsPage.jsx

import React, { Suspense, useEffect, useState } from 'react';
import { DiscountCategory } from '@/models/discount-category';
import { Discount } from '@/models/discount';
import { listDiscountCategories } from '@/providers/logged-in/discount-category.service';
import { listDiscounts } from '@/providers/logged-in/discount.service';
import { page, track } from '@/providers/analytics.service';
import Pager from '@/components/common/pager';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { langContent } from '@/utils/common';
import NoItems from '@/components/common/no-items';
import Loading from './loading';

const DiscountsPage = () => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [discountCategories, setDiscountCategories] = useState<DiscountCategory[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });
    
    const [filters, setFilters] = useState<{ category_id: number | null | undefined }>({ category_id: null });

    const { t } = useTranslation();
    
    useEffect(() => {
        loadCategories();
        //loadData(1);
 
        page('Discounts Page');

        return () => {
            track('page_exit', { page: 'Discounts Page' });
        }
   
    }, []);

    // Add this useEffect to call loadData when filters change
    useEffect(() => {
        loadData(1);
    }, [filters]);

    const loadCategories = async () => {
        const response = await listDiscountCategories(-1);
        setDiscountCategories(response.data);
    };

    const loadData = async (page: number, silent = false) => {
        if (!silent) {
            setLoading(true);
        }

        const response = await listDiscounts(page, getUrlParams());
        setLoading(false);

        setPagination({
            current_page: parseInt(response.headers['x-pagination-current-page']),
            total_pages: parseInt(response.headers['x-pagination-page-count']),
        });

        setDiscounts(response.data);
    };
 
    const getUrlParams = () => {
        let url = "";
        if (filters.category_id) {
            url += `&category_id=${filters.category_id}`;
        }
        return url;
    };

    const resetCategorySelected = () => {
        setFilters({ category_id: null });
        setDiscounts([]);
        loadData(1);
    };

    const onCategorySelected = (category: DiscountCategory) => {
        setFilters({ category_id: category.category_id });
        setDiscounts([]);
       // loadData(1);
        loadData(1);
    };

    const onSelected = async (discount: Discount) => {
        //todo: open modal
        /*const modal = await openModal(DiscountDetailPage, { model: discount });
        modal.onDidDismiss().then((e) => {
            if (!e.data || e.data.from !== 'native-back-btn') {
                window.history.back();
            }
        });*/
    };

    const openModal = async (Component: any, props: any) => {
        // Implement modal opening logic here
    };

    const errorLogo = (event: any, discount: Discount) => {
        if (discount.company) {
            discount.company.company_logo = null;
        }
    };

    const errorImage = (event: any, discount: Discount) => {
        if (discount.image) {
            discount.image = undefined;
        }
    };

    return (
        <Suspense fallback={<Loading />}>
        <div className=' bg-white'>
          <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

              <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
              { t('Discounts')}
              </h5>

          </div>    
        </div>
      
        <div className="max-w-4xl mx-auto p-6 w-full">

        <div className="mb-4">
                <Button variant="outline" onClick={resetCategorySelected} className={`me-1 rounded-2xl ${!filters.category_id ? 'bg-primary text-white' : 'bg-white'}`}>
                    {t("All")}
                </Button>
                {discountCategories.map((category: DiscountCategory) => (
                    <Button variant="outline" key={category.category_id} onClick={() => onCategorySelected(category)} 
                    className={`rounded-2xl me-1  ${filters.category_id === category.category_id ? 'bg-primary text-white' : 'bg-white'}`}>
                        {langContent(category.name_en, category.name_ar)} {/* Translate based on language */}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {discounts.map((discount) => (
                     <Card key={discount.discount_uuid}>
                        <CardHeader>
                            <CardTitle>{langContent(discount.company?.company_common_name_en, discount.company?.company_common_name_ar)}</CardTitle>
                            <CardDescription>{langContent(discount.description_en, discount.description_ar)}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {discount.image ? (
                                <img src={`${import.meta.env.VITE_PERMANENT_BUCKET_URL}discount/${discount.image}`} 
                                onError={(e) => errorImage(e, discount)} alt={discount.description_en} />
                            ) : (
                                <img src="/assets/icons/logo.svg" alt="Default" />
                            )} 
                            <p>{langContent(discount.how_to_apply_en, discount.how_to_apply_ar)}</p>  
                        </CardContent>
                     </Card>    
                ))}
            </div>

            {!loading && discounts.length === 0 && (
                <NoItems image="assets/icons/no-invitation.svg" 
                    title='Coming soon...'
                    message="" />
            )}

            <Pager pagination={pagination} loadPage={loadData} />
      
        </div>
        </Suspense>
    );
};

export default DiscountsPage;