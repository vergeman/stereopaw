App::Application.routes.draw do
  devise_for :users, controllers: { sessions: "sessions", registrations: "registrations", passwords: "passwords"}

  #custom devise route
  devise_scope :user do
    post '/users/auth' => "sessions#auth", :as => 'auth_user_session'
  end

  resources :users, only: ['show'] do
    resources :tracks, except: ['new', 'index'] #for now
  end

  #for marklet submission
  get '/tracks/new' => "tracks#new"

  #marklet successful submission redirect page
  get '/tracks/submit/:id', to: "tracks#submit", :as => "tracks_submit"

  post '/tracks/play', to: 'tracks#play'

  get '/new' => "tracks#latest"
  get '/popular' => "tracks#popular"
  get '/tracks' => "tracks#mytracks"

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  get '/meow' => 'main#index'

  # You can have the root of your site routed with "root"
  root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
