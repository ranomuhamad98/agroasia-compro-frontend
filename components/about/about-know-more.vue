<template>
    <div class="know-more-area-wrapper">
        <div class="know-more-area container">
            <div class="know-more-content">
                <h2 class="know-more-area__title">Know More About Shop</h2>
                <p class="know-more-area__subtitle">Trusted Organic Food Store For People</p>
                <div class="know-more-area__description">
                    <p>PT. Agro Asia Berdikari is an agribusiness company headquartered in South Tangerang, Indonesia.
                        We
                        specialize in agricultural management, crop production, and the export of agricultural products.
                    </p>
                    <p>Our comprehensive agricultural and livestock management programs span from upstream to downstream
                        processes, ensuring the highest quality of agricultural outputs. This integrated approach
                        benefits
                        farmers and all stakeholders involved.</p>
                </div>
                <div class="know-more-area-author">
                    <p class="know-more-area-author__name">Rano Muhammad</p>
                    <p class="know-more-area-author__subtitle">/ Pemilik Kafe</p>
                </div>
            </div>
            <div class="know-more-area-image">
                <nuxt-img src="/images/about/image.png" alt="about-img" width="542" />
            </div>
        </div>
        <div class="know-more-history container">
            <div class="history-startpoint">
                <span>2019</span>
            </div>
            <div class="history-endpoint">
                <span>2020</span>
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
                <span>2025</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/utils/_colors.scss' as *;

.know-more-area {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 4rem;
    margin-bottom: 5rem;

    @media (max-width: 480px) {
        flex-direction: column-reverse;
    }

    &__title {
        color: var(--tp-green-light);
        font-size: 1rem;
        font-weight: normal;
        margin-bottom: 1rem;
    }

    &__subtitle {
        font-size: 2.3rem;
        font-weight: 600;
        color: var(--tp-common-black);
        max-width: 400px;
        width: 100%;
        line-height: 1.2;
        margin-bottom: 1.5rem;
    }

    &__description {
        width: 100%;

        p {
            font-size: 1rem;
            font-weight: normal;
            color: var(--tp-blue-old-slate);
            line-height: 1.5;
            margin-bottom: 1rem;
        }
    }

    &-image {
        width: 100%;
        max-width: 542px;

        img {
            width: 100%;
            height: 100%;
            border-radius: .5rem;
            object-fit: cover;
        }
    }

    &-author {
        margin: 2rem 0;

        p {
            font-size: 1rem;
            margin-bottom: 0;
        }

        &__name {
            font-weight: 600;
            color: var(--tp-common-black);
        }

        &__subtitle {
            color: var(--tp-blue-slate);
            font-weight: lighter;
        }
    }
}

.know-more-history {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    gap: 2rem;
    margin-bottom: 10rem;

    .history {

        &-startpoint {
            height: 100%;

            span {
                font-size: 8rem;
                line-height: 1;
                color: var(--tp-green-light);
                font-weight: 600;
                opacity: 0.3;
            }
        }

        &-endpoint {
            display: flex;
            justify-content: space-around;
            align-items: center;
            gap: 2rem;
            border-top: 1px solid var(--tp-green-light);
            margin-top: 1rem;
            padding-top: 1.5rem;
            flex-grow: 1;
            flex-wrap: wrap;

            span {
                font-size: 1rem;
                font-weight: normal;
                color: var(--tp-green-light);
                position: relative;

                &:last-child {
                    color: var(--tp-green-moss);
                    &::before {
                        background-color: var(--tp-green-moss);
                    }
                }

                &::before {
                    content: '';
                    position: absolute;
                    top: -2rem;
                    left: calc(50% - 0.5rem);
                    border-radius: 50%;
                    background-color: var(--tp-green-light);
                    height: 1rem;
                    width: 1rem;
                }
            }
        }
    }
}
</style>