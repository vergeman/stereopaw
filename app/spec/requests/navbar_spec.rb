require 'spec_helper'

describe "Root Page" do

  describe "Visits '/meow' page"  do

    before {
      visit meow_path()
    }

    #we'll have to move our logged in tests (uses ajax
    #to determine session) to jasmine our some better
    #js testing framework
    describe "[Navigation]", :js => true do

      #--Topbar--#
      describe "Menu" do

        it "has a nav" do
          page.should have_css("body > nav")
        end

        it "has a logo area" do
          page.should have_css("body > nav > .logo")
        end

        it "has a title" do
          page.should have_selector("nav > .logo > h6 > a", 
                                    text: "Stupid Title Here")
        end

        it "is has a navigation wrap" do
          page.should have_css("#navigation-wrap")
        end

        it "is has an unordered navigation list" do
          page.should have_css("ul.navigation")
        end

      end


      describe "non-rendered js: list has navigation elements" do 
        
        #setup our navbar elements
        @navbar = [
                   #{
                   #  :content => 'Tracks',
                   #  :div => '#mytracks'
                   #},
                   #{
                   #  :content => 'Playlists',
                   #  :div => '#playlist'
                   #},
                   {
                     :content => 'Login',
                     :div => '#login_nav'
                   },

                   {
                     :content => 'New',
                     :div => '#new'
                   },
                   {
                     :content => 'Popular',
                     :div => '#popular'
                   },
                   {
                     :content => 'Submit',
                     :div => '#submit'
                   },
                   #{
                   #  :content => 'Settings',
                   #  :div => '#settings'
                   #}
                  ]

        #loop and test sidebar & navbar
        @navbar.each do | e |

          it "navbar w/ a list element with id #{e[:div]}" do
            page.should have_css("ul.navigation > li" + e[:div])
          end

          it "navbar with content #{e[:content]}" do
            page.should have_selector("ul.navigation > li" +e[:div], text: e[:content])

          end

        end


      end





    end #end Navigation

  end #end visits

end
